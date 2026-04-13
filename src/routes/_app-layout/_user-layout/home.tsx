import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { articleQueries } from "@/features/article/hooks/queries";
import { articleService } from "@/features/article/services/article.service";
import { BecomeMentorWidget } from "@/features/home/components/BecomeMentorWidget";
import { FeedArticleCard } from "@/features/home/components/FeedArticleCard";
import { RecommendedArticlesWidget } from "@/features/home/components/RecommendedArticlesWidget";
import { SavedListsWidget } from "@/features/home/components/SavedListsWidget";
import { SuggestedMentorsWidget } from "@/features/home/components/SuggestedMentorsWidget";
import { UpcomingSessionsWidget } from "@/features/home/components/UpcomingSessionsWidget";
import { mentorDiscoveryService } from "@/features/mentor-discovery/services/mentor-discovery.service";
import { mentorListsService } from "@/features/mentor-discovery/services/mentor-lists.service";
import { sessionBookingService } from "@/features/session-booking-management/services/session-booking.service";

export const Route = createFileRoute("/_app-layout/_user-layout/home")({
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData({
				queryKey: ["home", "suggested-mentors"],
				queryFn: () => mentorDiscoveryService.getMentors({ page: 1 }),
			}),
			queryClient.ensureQueryData({
				queryKey: ["home", "saved-lists"],
				queryFn: () => mentorListsService.getLists(),
			}),
			queryClient.ensureQueryData({
				queryKey: ["home", "upcoming-sessions"],
				queryFn: () =>
					sessionBookingService.getUserBookings({
						filter: "upcoming",
						limit: 10,
					}),
			}),
			queryClient.ensureQueryData({
				queryKey: ["home", "recommended-articles"],
				queryFn: () => articleService.getArticles({ page: 1, limit: 3 }),
			}),
			queryClient.ensureQueryData(articleQueries.list({ page: 1, limit: 3 })),
		]);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { auth } = useRouteContext({ from: "/_app-layout/_user-layout/home" });

	const { data: mentorsData } = useSuspenseQuery({
		queryKey: ["home", "suggested-mentors"],
		queryFn: () => mentorDiscoveryService.getMentors({ page: 1 }),
	});

	const { data: savedListsData } = useSuspenseQuery({
		queryKey: ["home", "saved-lists"],
		queryFn: () => mentorListsService.getLists(),
	});

	const { data: sessionsData } = useSuspenseQuery({
		queryKey: ["home", "upcoming-sessions"],
		queryFn: () =>
			sessionBookingService.getUserBookings({ filter: "upcoming", limit: 10 }),
	});

	const { data: recArticlesData } = useSuspenseQuery({
		queryKey: ["home", "recommended-articles"],
		queryFn: () => articleService.getArticles({ page: 1, limit: 3 }),
	});

	const { data: feedArticlesData } = useSuspenseQuery(
		articleQueries.list({ page: 1, limit: 3 }),
	);

	return (
		<div className="container mx-auto py-8 px-4 md:px-6">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
				{/* Left Sidebar */}
				<aside className="hidden lg:flex flex-col space-y-6 col-span-1">
					{auth.user?.role === "USER" && <BecomeMentorWidget />}
					<SuggestedMentorsWidget mentors={mentorsData.items} />
					<SavedListsWidget lists={savedListsData.items} />
				</aside>

				{/* Main Feed */}
				<main className="col-span-1 lg:col-span-2 flex flex-col space-y-6">
					{feedArticlesData.items.length === 0 ? (
						<div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground flex items-center justify-center h-48">
							No articles to show right now.
						</div>
					) : (
						<div className="flex flex-col space-y-6">
							<div className="grid grid-cols-1 gap-6">
								{feedArticlesData.items.slice(0, 3).map((article) => (
									<FeedArticleCard key={article.id} article={article} />
								))}
							</div>
							{feedArticlesData.items.length > 0 && (
								<Link
									to="/articles"
									search={(prev) => prev}
									className="w-full text-sm text-primary font-medium hover:underline pt-2 text-center"
								>
									View More Items in Feed
								</Link>
							)}
						</div>
					)}
				</main>

				{/* Right Sidebar */}
				<aside className="col-span-1 flex flex-col space-y-6">
					<UpcomingSessionsWidget
						sessions={sessionsData.data?.items?.slice(0, 3)}
					/>
					<RecommendedArticlesWidget articles={recArticlesData.items} />
				</aside>
			</div>
		</div>
	);
}
