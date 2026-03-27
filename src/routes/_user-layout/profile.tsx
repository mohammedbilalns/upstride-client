import {
	createFileRoute,
	Outlet,
	useRouteContext,
} from "@tanstack/react-router";
import { ProfileSidebar } from "@/features/profile-management/components/ProfileSidebar";

export const Route = createFileRoute("/_user-layout/profile")({
	component: ProfileLayout,
});

function ProfileLayout() {
	const { auth } = useRouteContext({ from: "/_user-layout/profile" });
	const { user } = auth;
	const isMentor = user?.role === "MENTOR";

	if (!user) return null;

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6 relative">
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						Account & Profile
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your personal information, security, and mentoring tools.
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
					<aside className="lg:w-[300px] shrink-0">
						<div className="lg:sticky top-6">
							<ProfileSidebar
								user={{
									name: user.name,
									email: user.email,
									role: user.role,
									profilePictureUrl: user.profilePictureUrl,
								}}
								isMentor={isMentor}
							/>
						</div>
					</aside>

					<section className="flex-1 min-w-0 min-h-0">
						<Outlet />
					</section>
				</div>
			</div>
		</div>
	);
}
