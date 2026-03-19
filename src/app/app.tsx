import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PendingComponent from "@/components/common/Pending-Component";
import { initAuthSession } from "@/features/authentication/utils/init-auth-session";
import { router } from "./router/routerConfig";

const App = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		const initAuth = async () => {
			await initAuthSession(router);
			if (mounted) {
				setLoading(false);
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
