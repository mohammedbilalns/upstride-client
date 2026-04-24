import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { queryClient } from "./app/router/routerConfig";
import { Toaster } from "./components/ui/Sonner";
import { PushNotificationService } from "./shared/services/push-notification.service";

PushNotificationService.register();

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<App />
				<Toaster richColors position="bottom-right" />
			</QueryClientProvider>
		</ThemeProvider>,
	);
}
