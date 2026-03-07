import { RouterProvider } from "@tanstack/react-router";
import PendingComponent from "@/components/common/Pending-Component";
import { useAuth } from "./contexts/AuthContext";
import { router } from "./router/routerConfig";

const App = () => {
	const { loading } = useAuth();

	if (loading) return <PendingComponent resource="session" />;

	return <RouterProvider router={router} />;
};

export default App;
