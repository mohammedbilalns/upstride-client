import api from "@/api/axios";
import { env } from "../config/env";

export class PushNotificationService {
	public static async register() {
		if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
			console.warn("Push messaging is not supported");
			return;
		}

		try {
			await navigator.serviceWorker.register("/sw.js");
			console.log("Service Worker registered");
		} catch (error) {
			console.error("Service Worker registration failed", error);
		}
	}

	public static async subscribeUser() {
		if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
			return;
		}

		try {
			// Wait for the service worker to be fully ready
			const registration = await navigator.serviceWorker.ready;

			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				console.warn("Notification permission denied");
				return;
			}

			let subscription = await registration.pushManager.getSubscription();

			// If we have an existing subscription, check if it's using the right key
			if (subscription) {
				const currentKey = this.urlBase64ToUint8Array(env.VAPID_PUBLIC_KEY);
				const subKey = new Uint8Array(
					subscription.options.applicationServerKey!,
				);

				const keysMatch =
					currentKey.length === subKey.length &&
					currentKey.every((v, i) => v === subKey[i]);

				if (!keysMatch) {
					console.log("VAPID key mismatch, unsubscribing...");
					await subscription.unsubscribe();
					subscription = null;
				}
			}

			if (!subscription) {
				const applicationServerKey = this.urlBase64ToUint8Array(
					env.VAPID_PUBLIC_KEY,
				);
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey,
				});
			}

			// Send subscription to backend
			await api.post("/notifications/register-push", subscription.toJSON());
			console.log("User subscribed to push notifications");
		} catch (error: any) {
			console.error("Failed to subscribe user", error);
		}
	}

	public static async unsubscribeUser() {
		if (!("serviceWorker" in navigator)) return;

		try {
			const registrations = await navigator.serviceWorker.getRegistrations();

			for (const registration of registrations) {
				const subscription = await registration.pushManager.getSubscription();
				if (subscription) {
					try {
						await api.delete("/notifications/register-push", {
							data: subscription.toJSON(),
						});
					} catch (apiError) {
						console.error(
							"Failed to delete subscription from backend",
							apiError,
						);
					}
					await subscription.unsubscribe();
				}
				// Unregister the service worker itself
				await registration.unregister();
			}

			console.log("User unsubscribed and service workers unregistered");
		} catch (error) {
			console.error("Error during unsubscription", error);
		}
	}

	private static urlBase64ToUint8Array(base64String: string) {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}
}
