import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

export const useWebRTC = (bookingId: string, socket: Socket | null) => {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [isMicOn, setIsMicOn] = useState(true);
	const [isCamOn, setIsCamOn] = useState(true);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isRemoteCamOn, setIsRemoteCamOn] = useState(true);
	const [isRemoteMicOn, setIsRemoteMicOn] = useState(true);

	const peerConnection = useRef<RTCPeerConnection | null>(null);

	const createPeerConnection = useCallback(() => {
		const pc = new RTCPeerConnection({
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "stun:stun1.l.google.com:19302" },
			],
		});

		pc.onicecandidate = (event) => {
			if (event.candidate && socket) {
				socket.emit("call:ice-candidate", {
					bookingId,
					candidate: event.candidate,
				});
			}
		};

		pc.ontrack = (event) => {
			setRemoteStream(event.streams[0]);
		};

		return pc;
	}, [bookingId, socket]);

	// Initialize Local Media
	const initLocalMedia = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			setLocalStream(stream);
			return stream;
		} catch (error) {
			console.error("Failed to get local media", error);
			return null;
		}
	}, []);

	const createOffer = useCallback(async () => {
		if (!peerConnection.current) return;
		try {
			const offer = await peerConnection.current.createOffer();
			await peerConnection.current.setLocalDescription(offer);
			socket?.emit("call:offer", { bookingId, offer });
		} catch (error) {
			console.error("Failed to create offer", error);
		}
	}, [socket, bookingId]);

	useEffect(() => {
		if (!socket) return;

		socket.on("call:user-joined", async ({ userId }) => {
			console.log("User joined, creating offer", userId);
			createOffer();
		});

		socket.on("call:offer", async ({ offer }) => {
			if (!peerConnection.current) return;
			try {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(offer),
				);
				const answer = await peerConnection.current.createAnswer();
				await peerConnection.current.setLocalDescription(answer);
				socket.emit("call:answer", { bookingId, answer });
			} catch (error) {
				console.error("Failed to handle offer", error);
			}
		});

		socket.on("call:answer", async ({ answer }) => {
			if (!peerConnection.current) return;
			try {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(answer),
				);
			} catch (error) {
				console.error("Failed to handle answer", error);
			}
		});

		socket.on("call:ice-candidate", async ({ candidate }) => {
			if (!peerConnection.current) return;
			try {
				await peerConnection.current.addIceCandidate(
					new RTCIceCandidate(candidate),
				);
			} catch (error) {
				console.error("Failed to handle ICE candidate", error);
			}
		});

		socket.on("call:toggled-media", ({ mediaType, isEnabled }) => {
			if (mediaType === "camera") setIsRemoteCamOn(isEnabled);
			if (mediaType === "mic") setIsRemoteMicOn(isEnabled);
		});

		return () => {
			socket.off("call:user-joined");
			socket.off("call:offer");
			socket.off("call:answer");
			socket.off("call:ice-candidate");
			socket.off("call:toggled-media");
		};
	}, [socket, bookingId, createOffer]);

	useEffect(() => {
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
			pc.close();
			if (localStream) {
				for (const track of localStream.getTracks()) {
					track.stop();
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run once to setup media and PC

	const toggleCam = useCallback(() => {
		if (localStream) {
			const videoTrack = localStream.getVideoTracks()[0];
			if (videoTrack) {
				const enabled = !videoTrack.enabled;
				videoTrack.enabled = enabled;
				setIsCamOn(enabled);
				socket?.emit("call:toggled-media", {
					bookingId,
					mediaType: "camera",
					isEnabled: enabled,
				});
			}
		}
	}, [localStream, socket, bookingId]);

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
		if (!peerConnection.current || !localStream) return;

		if (isScreenSharing) {
			// Stop sharing
			try {
				const newStream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				const videoTrack = newStream.getVideoTracks()[0];

				const sender = peerConnection.current
					.getSenders()
					.find((s) => s.track?.kind === "video");
				if (sender) {
					sender.replaceTrack(videoTrack);
				}

				// Update local stream
				localStream.removeTrack(localStream.getVideoTracks()[0]);
				localStream.addTrack(videoTrack);

				setIsScreenSharing(false);
				setIsCamOn(true);
				socket?.emit("call:toggled-media", {
					bookingId,
					mediaType: "camera",
					isEnabled: true,
				});
			} catch (e) {
				console.error("Failed to revert screen share", e);
			}
		} else {
			// Start sharing
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
				});
				const screenTrack = screenStream.getVideoTracks()[0];

				const sender = peerConnection.current
					.getSenders()
					.find((s) => s.track?.kind === "video");
				if (sender) {
					sender.replaceTrack(screenTrack);
				}

				// If user stops sharing via browser UI
				screenTrack.onended = () => {
					toggleScreenShare(); // revert functionally
				};

				localStream.removeTrack(localStream.getVideoTracks()[0]);
				localStream.addTrack(screenTrack);

				setIsScreenSharing(true);
			} catch (e) {
				console.error("Failed to share screen", e);
			}
		}
	}, [isScreenSharing, localStream, socket, bookingId]);

	return {
		localStream,
		remoteStream,
		isCamOn,
		isMicOn,
		isScreenSharing,
		isRemoteCamOn,
		isRemoteMicOn,
		toggleCam,
		toggleMic,
		toggleScreenShare,
	};
};
