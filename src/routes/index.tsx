import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/features/landing/pages/Landing";

export const Route = createFileRoute("/")({
	//TODO: ensure the user is not authenicated
	component: LandingPage,
	ssr: true,
});
