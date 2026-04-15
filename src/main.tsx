import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { queryClient } from "./app/router/routerConfig";
import { Toaster } from "./components/ui/sonner";
import { env } from "./shared/config/env";
import { PushNotificationService } from "./shared/services/push-notification.service";

PushNotificationService.register();

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
					<App />
					<Toaster richColors position="bottom-right" />
				</GoogleOAuthProvider>
			</QueryClientProvider>
		</ThemeProvider>,
	);
}
