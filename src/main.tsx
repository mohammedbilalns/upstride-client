import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import { AuthProvider } from "./app/contexts/AuthContext";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { queryClient, type router } from "./app/router/routerConfig";
import { Toaster } from "./components/ui/sonner";
import { env } from "./shared/config/env";

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
		//  Provides dark/light theme context to the entire app
		<ThemeProvider>
			{/* Provides React Query client for data fetching */}
			<QueryClientProvider client={queryClient}>
				{/* Provides authentication state and methods */}
				<AuthProvider>
					{/*Provides Google OAuth functionality */}
					<GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID || ""}>
						<App />
						{/* Toast notifications component */}
						<Toaster richColors position="bottom-right" />
					</GoogleOAuthProvider>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>,
	);
}
