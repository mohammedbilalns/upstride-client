import {
	createFileRoute,
	Outlet,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { ProfileSidebar } from "@/features/profile-management/components/ProfileSidebar";
import UserNavbar from "@/components/common/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/_mentor-layout")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}

		if (context.auth.user?.role !== "MENTOR") {
			throw redirect({
				to: "/home",
			});
		}
	},
	component: MentorLayout,
});

function MentorLayout() {
	const { auth } = useRouteContext({ from: "/_mentor-layout" });
	const { user } = auth;

	if (!user) return null;

	return (
		<div className="relative h-screen flex flex-col pt-20 overflow-hidden">
			<UserNavbar />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col h-full gap-6 relative">
				<div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
					<aside className="lg:w-[300px] shrink-0">
						<div className="lg:sticky top-0">
							<ProfileSidebar
								user={{
									name: user.name,
									email: user.email,
									role: user.role,
									profilePictureUrl: user.profilePictureUrl,
								}}
								isMentor={true}
							/>
						</div>
					</aside>

					<section className="flex-1 min-w-0 h-full">
						<ScrollArea className="h-full pr-4">
							<div className="pb-10">
								<Outlet />
							</div>
						</ScrollArea>
					</section>
				</div>
			</div>
		</div>
	);
}
