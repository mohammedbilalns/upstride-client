import { createFileRoute } from "@tanstack/react-router";
import { MentorArticlesPage } from "@/features/article/pages/MentorArticlesPage";
import { articleQueries } from "@/features/article/hooks/queries";

export const Route = createFileRoute("/_user-layout/mentor/articles/")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(articleQueries.list({ page: 1 }));
	},
	component: MentorArticlesPage,
});
