import { useCallback, useRef, useState } from "react";

export const useMediaDevices = (bookingId: string) => {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [localScreenStream, setLocalScreenStream] =
		useState<MediaStream | null>(null);
	const [isMicOn, setIsMicOn] = useState(true);
	const [isCamOn, setIsCamOn] = useState(true);
	const [isScreenSharing, setIsScreenSharing] = useState(false);

	const isLocalMediaReady = useRef(false);
	const localStreamRef = useRef<MediaStream | null>(null);
	const localScreenStreamRef = useRef<MediaStream | null>(null);

	const stopAllLocalMedia = useCallback(() => {
		if (localStreamRef.current) {
			for (const track of localStreamRef.current.getTracks()) {
				track.stop();
			}
		}

		if (localScreenStreamRef.current) {
			for (const track of localScreenStreamRef.current.getTracks()) {
				track.stop();
			}
		}

		localStreamRef.current = null;
		localScreenStreamRef.current = null;
		setLocalStream(null);
		setLocalScreenStream(null);
		setIsCamOn(true);
		setIsMicOn(true);
		setIsScreenSharing(false);
		isLocalMediaReady.current = false;
	}, []);

	const initLocalMedia = useCallback(async () => {
		console.log("[WebRTC] Initializing local media", bookingId);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			setLocalStream(stream);
			localStreamRef.current = stream;
			isLocalMediaReady.current = true;
			console.log("[WebRTC] Local media ready", bookingId);
			return stream;
		} catch (error) {
			console.error("[WebRTC] Failed to get local media", error, bookingId);
			return null;
		}
	}, [bookingId]);

	return {
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
		localStreamRef,
		localScreenStreamRef,
		initLocalMedia,
		stopAllLocalMedia,
	};
};
