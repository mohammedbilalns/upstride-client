import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { articleQueries } from "@/features/article/hooks/queries/useArticleQueries";

interface MentorArticlesSectionProps {
	authorId: string;
	isAdminView?: boolean;
}

export function MentorArticlesSection({
	authorId,
	isAdminView = false,
}: MentorArticlesSectionProps) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			...articleQueries.listInfinite({ authorId, limit: 8 }),
		});

	if (isLoading) {
		return (
			<div className="flex justify-center p-8">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const articles = data?.pages.flatMap((page) => page.items) ?? [];

	if (articles.length === 0) {
		return (
			<div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground w-full col-span-full">
				This mentor hasn't published any articles yet.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{articles.map((article) => (
					<ArticleCard
						key={article.id}
						article={article}
						isAdminView={isAdminView}
					/>
				))}
			</div>

			{hasNextPage && (
				<div className="flex justify-center pt-4">
					<Button
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</>
						) : (
							"Load More"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
