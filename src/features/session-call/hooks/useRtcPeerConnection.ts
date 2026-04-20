import { useCallback, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

export const useRTCPeerConnection = (
	bookingId: string,
	socket: Socket | null,
) => {
	const [remoteVideoStream, setRemoteVideoStream] =
		useState<MediaStream | null>(null);
	const [remoteScreenStream, setRemoteScreenStream] =
		useState<MediaStream | null>(null);
	const [isRemoteCamOn, setIsRemoteCamOn] = useState(true);
	const [isRemoteMicOn, setIsRemoteMicOn] = useState(true);
	const [isRemoteScreenSharing, setIsRemoteScreenSharing] = useState(false);

	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);
	const remoteCameraStreamId = useRef<string | null>(null);

	const clearRemoteState = useCallback(() => {
		setRemoteVideoStream(null);
		setRemoteScreenStream(null);
		setIsRemoteScreenSharing(false);
		setIsRemoteCamOn(true);
		setIsRemoteMicOn(true);
		remoteCameraStreamId.current = null;
		iceCandidateQueue.current = [];
	}, []);

	const teardownConnection = useCallback(() => {
		if (peerConnection.current) {
			peerConnection.current.ontrack = null;
			peerConnection.current.onicecandidate = null;
			peerConnection.current.oniceconnectionstatechange = null;
			peerConnection.current.onsignalingstatechange = null;
			peerConnection.current.onconnectionstatechange = null;
			peerConnection.current.close();
			peerConnection.current = null;
		}
		clearRemoteState();
	}, [clearRemoteState]);

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
				socket.emit("call:ice-candidate", {
					bookingId,
					candidate: event.candidate,
				});
			}
		};

		pc.ontrack = (event) => {
			const stream = event.streams[0];
			if (!stream) return;

			if (event.track.kind === "video") {
				if (
					!remoteCameraStreamId.current ||
					stream.id === remoteCameraStreamId.current
				) {
					remoteCameraStreamId.current = stream.id;
					setRemoteVideoStream(stream);
				} else {
					setRemoteScreenStream(stream);
					setIsRemoteScreenSharing(true);

					stream.onremovetrack = () => {
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

	return {
		peerConnection,
		iceCandidateQueue,
		remoteVideoStream,
		setRemoteVideoStream,
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
	};
};
