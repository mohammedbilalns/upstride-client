import { createFileRoute } from "@tanstack/react-router";
import { ActiveSessionList } from "@/features/authentication/components/ActiveSessionList";
import { activeSessionsQueryOptions } from "@/features/authentication/hooks/use-active-sessions";

export const Route = createFileRoute("/_user-layout/profile")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(activeSessionsQueryOptions);
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="container mx-auto px-6 py-10 space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
					Account Settings
				</h1>
				<p className="text-muted-foreground">
					Manage your personal information and security preferences.
				</p>
			</div>

			{/* Security Section */}
			<section className="space-y-6">
				<div className="flex items-center gap-2">
					<div className="h-2 w-2 rounded-full bg-primary" />
					<h2 className="text-xl font-bold tracking-tight">Security</h2>
				</div>
				<ActiveSessionList />
			</section>
		</main>
	);
}
