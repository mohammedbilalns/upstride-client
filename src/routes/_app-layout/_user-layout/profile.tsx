import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Outlet,
	useRouteContext,
} from "@tanstack/react-router";
import { ProfileSidebar } from "@/features/profile-management/components/ProfileSidebar";
import { profileQueryOptions } from "@/features/profile-management/hooks/use-profile";

export const Route = createFileRoute("/_app-layout/_user-layout/profile")({
	component: ProfileLayout,
});

function ProfileLayout() {
	const { auth } = useRouteContext({
		from: "/_app-layout/_user-layout/profile",
	});
	const { user } = auth;
	const isMentor = user?.role === "MENTOR";
	const { data: profile } = useQuery({
		...profileQueryOptions,
		enabled: Boolean(user?.id),
	});

	if (!user) return null;

	return (
		<div className="relative min-h-[calc(100vh-5rem)]">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 relative">
				<div className="flex flex-col lg:flex-row gap-8">
					<aside className="lg:w-75 shrink-0 relative z-[60]">
						<div className="lg:sticky top-0">
							<ProfileSidebar
								user={{
									name: profile?.name ?? user.name,
									email: user.email,
									role: user.role,
									profilePictureUrl:
										profile?.profilePictureUrl ?? user.profilePictureUrl,
								}}
								isMentor={isMentor}
							/>
						</div>
					</aside>

					<section className="flex-1 min-w-0">
						<div className="pb-10">
							<Outlet />
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
