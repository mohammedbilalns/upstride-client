/* eslint-disable no-restricted-globals */
// Listen for incoming push messages
self.addEventListener("push", (event) => {
	console.log("[Service Worker] Push Received.");
	let data = {};
	try {
		data = event.data ? event.data.json() : {};
		console.log("[Service Worker] Push Data:", data);
	} catch (err) {
		console.warn(
			"[Service Worker] Push data was not valid JSON:",
			event.data.text(),
		);
	}

	const title = data.title || "New Notification";
	const options = {
		body: data.body || "You have a new notification from Upstride.",
		icon: "/logo192.png",
		badge: "/favicon.ico",
		data: {
			link: data.link || "/",
		},
	};

	console.log("[Service Worker] Showing Notification:", title);
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const urlToOpen = event.notification.data.link;

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((windowClients) => {
				for (const client of windowClients) {
					if (client.url === urlToOpen && "focus" in client) {
						return client.focus();
					}
				}
				if (clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			}),
	);
});
