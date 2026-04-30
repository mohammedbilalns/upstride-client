export const playNotificationSound = () => {
	try {
		const AudioContext =
			window.AudioContext || (window as any).webkitAudioContext;
		if (!AudioContext) return;
		const audioCtx = new AudioContext();

		const osc = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();

		osc.type = "sine";

		osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
		osc.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.15); // C5

		gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
		gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
		gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.15);
		gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.16);
		gainNode.gain.exponentialRampToValueAtTime(
			0.01,
			audioCtx.currentTime + 0.6,
		);

		osc.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		osc.start(audioCtx.currentTime);
		osc.stop(audioCtx.currentTime + 0.6);
	} catch (err) {
		console.warn("Failed to play notification sound:", err);
	}
};

export const startRinging = (): (() => void) => {
	let intervalId: number | NodeJS.Timeout;
	let isRinging = true;

	const ring = () => {
		if (!isRinging) return;
		playNotificationSound();
	};

	ring(); // Play first ring immediately
	intervalId = setInterval(ring, 2000); // Repeat every 2 seconds

	return () => {
		isRinging = false;
		clearInterval(intervalId as number);
	};
};
