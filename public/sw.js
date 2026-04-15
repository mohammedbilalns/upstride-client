/* eslint-disable no-restricted-globals */
// Listen for incoming push messages
self.addEventListener("push", (event) => {
	// convert raw data to json if presnt
	const data = event.data ? event.data.json() : {};
	const title = data.title || "New Notification";
	const options = {
		body: data.body || "You have a new notification from Upstride.",
		icon: "/logo192.png",
		badge: "/favicon.ico",
		data: {
			link: data.link || "/",
		},
	};
	// keep alive until task completes
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const urlToOpen = event.notification.data.link;

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((windowClients) => {
				for (let i = 0; i < windowClients.length; i++) {
					const client = windowClients[i];
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
