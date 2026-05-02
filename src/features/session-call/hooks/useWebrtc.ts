import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { useMediaDevices } from "./useMediaDevices";
import { useRTCPeerConnection } from "./useRtcPeerConnection";

export const useWebRTC = (
	bookingId: string,
	socket: Socket | null,
	enabled: boolean = true,
) => {
	const {
		localStream,
		setLocalStream,
		localScreenStream,
		setLocalScreenStream,
		isMicOn,
		setIsMicOn,
		isCamOn,
		setIsCamOn,
		isScreenSharing,
		setIsScreenSharing,
		isLocalMediaReady,
		initLocalMedia,
		stopAllLocalMedia,
	} = useMediaDevices(bookingId);

	const {
		peerConnection,
		iceCandidateQueue,
		remoteVideoStream,
		remoteScreenStream,
		setRemoteScreenStream,
		isRemoteCamOn,
		setIsRemoteCamOn,
		isRemoteMicOn,
		setIsRemoteMicOn,
		isRemoteScreenSharing,
		setIsRemoteScreenSharing,
		clearRemoteState,
		teardownConnection,
		createPeerConnection,
	} = useRTCPeerConnection(bookingId, socket);

	const leaveSession = useCallback(() => {
		teardownConnection();
		stopAllLocalMedia();
	}, [stopAllLocalMedia, teardownConnection]);

	const createOffer = useCallback(async () => {
		if (!peerConnection.current) return;

		if (!isLocalMediaReady.current) {
			setTimeout(() => createOffer(), 500);
			return;
		}

		try {
			console.log("[WebRTC] Creating offer", bookingId);
			const offer = await peerConnection.current.createOffer();
			await peerConnection.current.setLocalDescription(offer);
			socket?.emit("call:offer", { bookingId, offer });
		} catch (error) {
			console.error("[WebRTC] Failed to create offer", error, bookingId);
		}
	}, [socket, bookingId, isLocalMediaReady, peerConnection]);

	const resetConnection = useCallback(() => {
		console.log("[WebRTC] Resetting peer connection", bookingId);
		if (peerConnection.current) {
			peerConnection.current.close();
			peerConnection.current = null;
		}

		clearRemoteState();

		const pc = createPeerConnection();
		peerConnection.current = pc;

		// Re-add existing local tracks
		if (localStream) {
			for (const track of localStream.getTracks()) {
				pc.addTrack(track, localStream);
			}
		}

		if (localScreenStream) {
			for (const track of localScreenStream.getTracks()) {
				pc.addTrack(track, localScreenStream);
			}
		}

		return pc;
	}, [
		bookingId,
		clearRemoteState,
		createPeerConnection,
		localStream,
		localScreenStream,
		peerConnection,
	]);

	// Signaling logic
	useEffect(() => {
		if (!socket) return;

		const handleUserJoined = async () => {
			resetConnection();
			createOffer();
		};

		const handleOffer = async ({
			offer,
		}: {
			offer: RTCSessionDescriptionInit;
		}) => {
			if (!peerConnection.current) return;
			if (!isLocalMediaReady.current) {
				setTimeout(() => handleOffer({ offer }), 500);
				return;
			}

			try {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(offer),
				);
				while (iceCandidateQueue.current.length > 0) {
					const candidate = iceCandidateQueue.current.shift();
					if (candidate) {
						await peerConnection.current.addIceCandidate(candidate);
					}
				}

				const answer = await peerConnection.current.createAnswer();
				await peerConnection.current.setLocalDescription(answer);
				socket.emit("call:answer", { bookingId, answer });
			} catch (error) {
				console.error("[WebRTC] Failed to handle offer", error, bookingId);
			}
		};

		const handleAnswer = async ({
			answer,
		}: {
			answer: RTCSessionDescriptionInit;
		}) => {
			if (!peerConnection.current) return;
			try {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(answer),
				);
				while (iceCandidateQueue.current.length > 0) {
					const candidate = iceCandidateQueue.current.shift();
					if (candidate) {
						await peerConnection.current.addIceCandidate(candidate);
					}
				}
			} catch (error) {
				console.error("[WebRTC] Failed to handle answer", error, bookingId);
			}
		};

		const handleIceCandidate = async ({
			candidate,
		}: {
			candidate: RTCIceCandidateInit;
		}) => {
			if (!peerConnection.current) return;
			try {
				if (peerConnection.current.remoteDescription) {
					await peerConnection.current.addIceCandidate(
						new RTCIceCandidate(candidate),
					);
				} else {
					iceCandidateQueue.current.push(candidate);
				}
			} catch (error) {
				console.error(
					"[WebRTC] Failed to handle ICE candidate",
					error,
					bookingId,
				);
			}
		};

		const handleToggledMedia = ({
			mediaType,
			isEnabled,
		}: {
			mediaType: string;
			isEnabled: boolean;
		}) => {
			if (mediaType === "camera") setIsRemoteCamOn(isEnabled);
			if (mediaType === "mic") setIsRemoteMicOn(isEnabled);
			if (mediaType === "screen") {
				setIsRemoteScreenSharing(isEnabled);
				if (!isEnabled) setRemoteScreenStream(null);
			}
		};

		const handleUserLeft = () => {
			teardownConnection();
		};

		socket.on("call:user-joined", handleUserJoined);
		socket.on("call:offer", handleOffer);
		socket.on("call:answer", handleAnswer);
		socket.on("call:ice-candidate", handleIceCandidate);
		socket.on("call:toggled-media", handleToggledMedia);
		socket.on("call:user-left", handleUserLeft);

		return () => {
			socket.off("call:user-joined", handleUserJoined);
			socket.off("call:offer", handleOffer);
			socket.off("call:answer", handleAnswer);
			socket.off("call:ice-candidate", handleIceCandidate);
			socket.off("call:toggled-media", handleToggledMedia);
			socket.off("call:user-left", handleUserLeft);
		};
	}, [
		socket,
		bookingId,
		createOffer,
		resetConnection,
		teardownConnection,
		peerConnection,
		isLocalMediaReady,
		iceCandidateQueue,
		setIsRemoteCamOn,
		setIsRemoteMicOn,
		setIsRemoteScreenSharing,
		setRemoteScreenStream,
	]);

	// Lifecycle logic
	useEffect(() => {
		if (!socket || !enabled) return;

		const pc = createPeerConnection();
		peerConnection.current = pc;

		initLocalMedia().then((stream) => {
			if (stream && peerConnection.current) {
				for (const track of stream.getTracks()) {
					peerConnection.current.addTrack(track, stream);
				}
			}
		});

		return () => {
			leaveSession();
		};
	}, [socket, createPeerConnection, enabled]);

	const toggleCam = useCallback(async () => {
		if (!peerConnection.current) return;

		if (isCamOn && localStream) {
			localStream.getVideoTracks().forEach((t) => t.stop());
			setIsCamOn(false);
			socket?.emit("call:toggled-media", {
				bookingId,
				mediaType: "camera",
				isEnabled: false,
			});
		} else {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				const newTrack = stream.getVideoTracks()[0];
				const sender = peerConnection.current
					.getSenders()
					.find(
						(s) =>
							s.track?.kind === "video" && !s.track.label.includes("screen"),
					);

				if (sender) await sender.replaceTrack(newTrack);
				else peerConnection.current.addTrack(newTrack, localStream || stream);

				if (localStream) {
					const newStream = new MediaStream([
						newTrack,
						...localStream.getAudioTracks(),
					]);
					setLocalStream(newStream);
				} else {
					setLocalStream(stream);
				}

				setIsCamOn(true);
				socket?.emit("call:toggled-media", {
					bookingId,
					mediaType: "camera",
					isEnabled: true,
				});
			} catch (e) {
				console.error("Failed to start camera", e);
			}
		}
	}, [
		isCamOn,
		localStream,
		socket,
		bookingId,
		peerConnection,
		setLocalStream,
		setIsCamOn,
	]);

	const toggleMic = useCallback(() => {
		if (localStream) {
			const audioTrack = localStream.getAudioTracks()[0];
			if (audioTrack) {
				const enabled = !audioTrack.enabled;
				audioTrack.enabled = enabled;
				setIsMicOn(enabled);
				socket?.emit("call:toggled-media", {
					bookingId,
					mediaType: "mic",
					isEnabled: enabled,
				});
			}
		}
	}, [localStream, socket, bookingId, setIsMicOn]);

	const toggleScreenShare = useCallback(async () => {
		if (!peerConnection.current) return;

		if (isScreenSharing) {
			if (localScreenStream) {
				localScreenStream.getTracks().forEach((t) => t.stop());
				const sender = peerConnection.current
					.getSenders()
					.find((s) => s.track === localScreenStream.getVideoTracks()[0]);
				if (sender) peerConnection.current.removeTrack(sender);
				setLocalScreenStream(null);
			}
			setIsScreenSharing(false);
			socket?.emit("call:toggled-media", {
				bookingId,
				mediaType: "screen",
				isEnabled: false,
			});
			createOffer();
		} else {
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
				});
				const screenTrack = screenStream.getVideoTracks()[0];

				Object.defineProperty(screenStream, "id", {
					value: `screen_${Date.now()}`,
				});

				peerConnection.current.addTrack(screenTrack, screenStream);
				screenTrack.onended = () => {
					toggleScreenShare();
				};

				setLocalScreenStream(screenStream);
				setIsScreenSharing(true);
				socket?.emit("call:toggled-media", {
					bookingId,
					mediaType: "screen",
					isEnabled: true,
				});
				createOffer();
			} catch (e) {
				console.error("Failed to share screen", e);
			}
		}
	}, [
		isScreenSharing,
		localScreenStream,
		createOffer,
		peerConnection,
		setLocalScreenStream,
		setIsScreenSharing,
		socket,
		bookingId,
	]);

	return {
		localStream,
		localScreenStream,
		remoteVideoStream,
		remoteScreenStream,
		isCamOn,
		isMicOn,
		isScreenSharing,
		isRemoteScreenSharing,
		isRemoteCamOn,
		isRemoteMicOn,
		toggleCam,
		toggleMic,
		toggleScreenShare,
		leaveSession,
	};
};
