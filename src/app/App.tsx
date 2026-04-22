import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PendingComponent from "@/components/common/PendingComponent";
import { initAuthSession } from "@/features/auth/utils/initAuthSession";
import { router } from "./router/routerConfig";

const App = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		const initAuth = async () => {
			await initAuthSession(router);
			if (mounted) {
				setLoading(false);
				import("@/shared/services/push-notification.service").then(
					({ PushNotificationService }) => {
						PushNotificationService.subscribeUser().catch(console.error);
					},
				);
			}
		};

		initAuth();
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) return <PendingComponent resource="session" />;

	return <RouterProvider router={router} />;
};

export default App;
