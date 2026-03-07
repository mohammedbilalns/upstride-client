import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import { AuthProvider } from "./app/contexts/AuthContext";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { queryClient, type router } from "./app/router/routerConfig";
import { Toaster } from "./components/ui/sonner";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found in html");

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<App />
					<Toaster richColors position="bottom-right" />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>,
	);
}
