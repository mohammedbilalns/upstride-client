import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { AuthProvider, useAuth } from "./app/contexts/AuthContext";
import { queryClient, router } from "./app/router/routerConfig";
import PendingComponent from "./components/common/Pending-Component";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const App = () => {
	const { loading } = useAuth();

	if (loading) {
		return <PendingComponent resource="Session" />;
	}

	return <RouterProvider router={router} />;
};

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<App />
					<Toaster richColors position="top-right" />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>,
	);
}
