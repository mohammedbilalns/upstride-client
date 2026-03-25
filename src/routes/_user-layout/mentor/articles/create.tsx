import { createFileRoute } from "@tanstack/react-router";
import { CreateArticlePage } from "@/features/article/pages/CreateArticlePage";

export const Route = createFileRoute("/_user-layout/mentor/articles/create")({
	component: CreateArticlePage,
});
