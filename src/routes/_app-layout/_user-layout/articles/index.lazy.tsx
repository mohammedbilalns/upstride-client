import { createLazyFileRoute } from "@tanstack/react-router";
import { ArticlesPage } from "@/features/article/pages/ArticlesPage";

export const Route = createLazyFileRoute("/_app-layout/_user-layout/articles/")(
	{
		component: ArticlesPage,
	},
);
