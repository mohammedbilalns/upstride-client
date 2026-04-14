import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

export const useWebRTC = (bookingId: string, socket: Socket | null) => {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [localScreenStream, setLocalScreenStream] =
		useState<MediaStream | null>(null);
	const [remoteVideoStream, setRemoteVideoStream] =
		useState<MediaStream | null>(null);
	const [remoteScreenStream, setRemoteScreenStream] =
		useState<MediaStream | null>(null);
	const [isMicOn, setIsMicOn] = useState(true);
	const [isCamOn, setIsCamOn] = useState(true);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isRemoteCamOn, setIsRemoteCamOn] = useState(true);
	const [isRemoteMicOn, setIsRemoteMicOn] = useState(true);
	const [isRemoteScreenSharing, setIsRemoteScreenSharing] = useState(false);

	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const isLocalMediaReady = useRef(false);
	const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);
	const remoteCameraStreamId = useRef<string | null>(null);

	const createPeerConnection = useCallback(() => {
		const pc = new RTCPeerConnection({
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "stun:stun1.l.google.com:19302" },
			],
		});

		pc.oniceconnectionstatechange = () => {
			console.log(
				"[WebRTC] ICE Connection State:",
				pc.iceConnectionState,
				bookingId,
			);
		};

		pc.onsignalingstatechange = () => {
			console.log("[WebRTC] Signaling State:", pc.signalingState, bookingId);
		};

		pc.onconnectionstatechange = () => {
			console.log("[WebRTC] Connection State:", pc.connectionState, bookingId);
		};

		pc.onicecandidate = (event) => {
			if (event.candidate && socket) {
				console.log(
					"[WebRTC] Sending ICE candidate",
					event.candidate.candidate.slice(0, 30) + "...",
					bookingId,
				);
				socket.emit("call:ice-candidate", {
					bookingId,
					candidate: event.candidate,
				});
			} else if (event.candidate && !socket) {
				console.warn(
					"[WebRTC] Cannot send ICE candidate: Socket is null",
					bookingId,
				);
			}
		};

		pc.ontrack = (event) => {
			console.log(
				"[WebRTC] Received remote track",
				event.track.kind,
				"Stream ID:",
				event.streams[0]?.id,
				bookingId,
			);
			const stream = event.streams[0];
			if (!stream) {
				console.warn("[WebRTC] No stream found for track", bookingId);
				return;
			}

			if (event.track.kind === "audio") {
				// Audio tracks are usually handled by the same stream
				return;
			}

			if (event.track.kind === "video") {
				// If this is the first video stream we see, or it matches our known camera ID
				if (
					!remoteCameraStreamId.current ||
					stream.id === remoteCameraStreamId.current
				) {
					console.log(
						"[WebRTC] Setting remote video stream (camera)",
						stream.id,
						bookingId,
					);
					remoteCameraStreamId.current = stream.id;
					setRemoteVideoStream(stream);
				} else {
					// It's a different stream ID, so it's likely a screen share
					console.log(
						"[WebRTC] Setting remote screen stream",
						stream.id,
						bookingId,
					);
					setRemoteScreenStream(stream);
					setIsRemoteScreenSharing(true);

					stream.onremovetrack = () => {
						console.log(
							"[WebRTC] Remote screen track removed",
							stream.id,
							bookingId,
						);
						if (stream.getTracks().length === 0) {
							setRemoteScreenStream(null);
							setIsRemoteScreenSharing(false);
						}
					};
				}
			}
		};

		return pc;
	}, [bookingId, socket]);

	// Initialize Local Media
	const initLocalMedia = useCallback(async () => {
		console.log("[WebRTC] Initializing local media", bookingId);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			setLocalStream(stream);
			isLocalMediaReady.current = true;
			console.log("[WebRTC] Local media ready", bookingId);
			return stream;
		} catch (error) {
			console.error("[WebRTC] Failed to get local media", error, bookingId);
			return null;
		}
	}, [bookingId]);

	const createOffer = useCallback(async () => {
		if (!peerConnection.current) {
			console.warn(
				"[WebRTC] Cannot create offer: No peer connection",
				bookingId,
			);
			return;
		}

		if (!isLocalMediaReady.current) {
			console.log("[WebRTC] Deferring offer: Local media not ready", bookingId);
			setTimeout(() => createOffer(), 500);
			return;
		}

		try {
			console.log("[WebRTC] Creating offer", bookingId);
			const offer = await peerConnection.current.createOffer();
			await peerConnection.current.setLocalDescription(offer);
			console.log("[WebRTC] Local description set (offer)", bookingId);
			socket?.emit("call:offer", { bookingId, offer });
		} catch (error) {
			console.error("[WebRTC] Failed to create offer", error, bookingId);
		}
	}, [socket, bookingId]);

	const resetConnection = useCallback(() => {
		console.log("[WebRTC] Resetting peer connection", bookingId);
		if (peerConnection.current) {
			peerConnection.current.close();
			peerConnection.current = null;
		}

		// Clear remote streams and identification
		setRemoteVideoStream(null);
		setRemoteScreenStream(null);
		setIsRemoteScreenSharing(false);
		setIsRemoteCamOn(true);
		setIsRemoteMicOn(true);
		remoteCameraStreamId.current = null;
		iceCandidateQueue.current = [];

		const pc = createPeerConnection();
		peerConnection.current = pc;

		// Re-add existing local tracks
		if (localStream) {
			console.log(
				"[WebRTC] Re-adding local tracks to new connection",
				bookingId,
			);
			for (const track of localStream.getTracks()) {
				pc.addTrack(track, localStream);
			}
		}

		if (localScreenStream) {
			console.log(
				"[WebRTC] Re-adding local screen tracks to new connection",
				bookingId,
			);
			for (const track of localScreenStream.getTracks()) {
				pc.addTrack(track, localScreenStream);
			}
		}

		return pc;
	}, [bookingId, createPeerConnection, localStream, localScreenStream]);

	useEffect(() => {
		if (!socket) return;

		socket.on("call:user-joined", async ({ userId }) => {
			console.log(
				"[WebRTC] User joined, resetting connection",
				userId,
				bookingId,
			);
			resetConnection();
			createOffer();
		});

		const handleOffer = async ({ offer }: { offer: any }) => {
			if (!peerConnection.current) return;
			console.log("[WebRTC] Processing call:offer", bookingId);

			if (!isLocalMediaReady.current) {
				console.log(
					"[WebRTC] Deferring answer: Local media not ready",
					bookingId,
				);
				setTimeout(() => handleOffer({ offer }), 500);
				return;
			}

			try {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(offer),
				);
				console.log("[WebRTC] Remote description set (offer)", bookingId);

				// Process queued ICE candidates
				while (iceCandidateQueue.current.length > 0) {
					const candidate = iceCandidateQueue.current.shift();
					if (candidate) {
						console.log("[WebRTC] Adding queued ICE candidate", bookingId);
						await peerConnection.current.addIceCandidate(candidate);
					}
				}

				const answer = await peerConnection.current.createAnswer();
				await peerConnection.current.setLocalDescription(answer);
				console.log("[WebRTC] Local description set (answer)", bookingId);
				socket.emit("call:answer", { bookingId, answer });
			} catch (error) {
				console.error("[WebRTC] Failed to handle offer", error, bookingId);
			}
		};

		socket.on("call:offer", handleOffer);

		socket.on("call:answer", async ({ answer }) => {
			if (!peerConnection.current) return;
			console.log("[WebRTC] Received call:answer", bookingId);
			try {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(answer),
				);
				console.log("[WebRTC] Remote description set (answer)", bookingId);

				// Process queued ICE candidates
				while (iceCandidateQueue.current.length > 0) {
					const candidate = iceCandidateQueue.current.shift();
					if (candidate) {
						console.log("[WebRTC] Adding queued ICE candidate", bookingId);
						await peerConnection.current.addIceCandidate(candidate);
					}
				}
			} catch (error) {
				console.error("[WebRTC] Failed to handle answer", error, bookingId);
			}
		});

		socket.on("call:ice-candidate", async ({ candidate }) => {
			if (!peerConnection.current) return;
			console.log("[WebRTC] Received call:ice-candidate", bookingId);
			try {
				if (peerConnection.current.remoteDescription) {
					await peerConnection.current.addIceCandidate(
						new RTCIceCandidate(candidate),
					);
					console.log("[WebRTC] Added ICE candidate", bookingId);
				} else {
					console.log(
						"[WebRTC] Queuing ICE candidate (no remote desc)",
						bookingId,
					);
					iceCandidateQueue.current.push(candidate);
				}
			} catch (error) {
				console.error(
					"[WebRTC] Failed to handle ICE candidate",
					error,
					bookingId,
				);
			}
		});

		socket.on("call:toggled-media", ({ mediaType, isEnabled }) => {
			console.log(
				`[WebRTC] Remote toggled ${mediaType}: ${isEnabled}`,
				bookingId,
			);
			if (mediaType === "camera") setIsRemoteCamOn(isEnabled);
			if (mediaType === "mic") setIsRemoteMicOn(isEnabled);
			if (mediaType === "screen") {
				setIsRemoteScreenSharing(isEnabled);
				if (!isEnabled) {
					setRemoteScreenStream(null);
				}
			}
		});

		socket.on("call:user-left", () => {
			console.log("[WebRTC] User left, clearing remote state", bookingId);
			setIsRemoteScreenSharing(false);
			setIsRemoteCamOn(true);
			setIsRemoteMicOn(true);
			setRemoteVideoStream(null);
			setRemoteScreenStream(null);
			remoteCameraStreamId.current = null;
			if (peerConnection.current) {
				console.log(
					"[WebRTC] Closing peer connection due to user-left",
					bookingId,
				);
				peerConnection.current.close();
				peerConnection.current = null;
			}
		});

		return () => {
			socket.off("call:user-joined");
			socket.off("call:user-left");
			socket.off("call:offer");
			socket.off("call:answer");
			socket.off("call:ice-candidate");
			socket.off("call:toggled-media");
		};
	}, [socket, bookingId, createOffer, resetConnection]);

	useEffect(() => {
		if (!socket) {
			console.log(
				"[WebRTC] Postponing initial peer connection: Socket not ready",
				bookingId,
			);
			return;
		}

		console.log("[WebRTC] Creating initial peer connection", bookingId);
		const pc = createPeerConnection();
		peerConnection.current = pc;

		initLocalMedia().then((stream) => {
			if (stream && peerConnection.current) {
				console.log("[WebRTC] Adding initial local tracks", bookingId);
				for (const track of stream.getTracks()) {
					peerConnection.current.addTrack(track, stream);
				}
			}
		});

		return () => {
			console.log("[WebRTC] Cleaning up peer connection", bookingId);
			if (peerConnection.current) {
				peerConnection.current.close();
				peerConnection.current = null;
			}
			if (localStream) {
				for (const track of localStream.getTracks()) {
					track.stop();
				}
			}
			if (localScreenStream) {
				for (const track of localScreenStream.getTracks()) {
					track.stop();
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, createPeerConnection]);

	const toggleCam = useCallback(async () => {
		if (!peerConnection.current) return;

		if (isCamOn && localStream) {
			// Stop tracks
			localStream.getVideoTracks().forEach((t) => t.stop());
			setIsCamOn(false);
			socket?.emit("call:toggled-media", {
				bookingId,
				mediaType: "camera",
				isEnabled: false,
			});
		} else {
			// Start tracks
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
				if (sender) {
					await sender.replaceTrack(newTrack);
				} else {
					peerConnection.current.addTrack(newTrack, localStream || stream);
				}

				if (localStream) {
					// Create a NEW MediaStream instance to trigger React/DOM updates
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
	}, [isCamOn, localStream, socket, bookingId]);

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
	}, [localStream, socket, bookingId]);

	const toggleScreenShare = useCallback(async () => {
		if (!peerConnection.current) return;

		if (isScreenSharing) {
			if (localScreenStream) {
				localScreenStream.getTracks().forEach((t) => t.stop());
				const sender = peerConnection.current
					.getSenders()
					.find((s) => s.track === localScreenStream.getVideoTracks()[0]);
				if (sender) {
					peerConnection.current.removeTrack(sender);
				}
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

				// Tag the stream for remote identification (may not persist across all browsers but serves as hint)
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
	}, [isScreenSharing, localScreenStream, createOffer]);

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
	};
};
