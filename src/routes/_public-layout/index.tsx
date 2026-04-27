import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/features/landing/pages/Landing";

export const Route = createFileRoute("/_public-layout/")({
	component: LandingPage,
});
