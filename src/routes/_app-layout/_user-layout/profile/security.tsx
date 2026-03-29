import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ActiveSessionList } from "@/features/authentication/components/ActiveSessionList";
import { activeSessionsQueryOptions } from "@/features/authentication/hooks/use-active-sessions";
import { ChangePasswordModal, useProfile } from "@/features/profile-management";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/profile/security",
)({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(activeSessionsQueryOptions);
	},
	component: SecurityPage,
});

function SecurityPage() {
	const { data: profile } = useProfile();
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	return (
		<div className="animate-in fade-in duration-500 space-y-6">
			<div className="flex items-center gap-2.5">
				<div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
					<ShieldCheck className="h-4.5 w-4.5" />
				</div>
				<h2 className="text-xl font-semibold tracking-tight">
					Security & Sessions
				</h2>
			</div>

			<div className="space-y-6">
				{profile?.authType === "LOCAL" && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/40 shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-950/60">
						<div className="flex items-center gap-4">
							<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
								<Lock className="h-5 w-5" />
							</div>
							<div>
								<p className="font-bold text-zinc-900 dark:text-zinc-50">
									Password Security
								</p>
								<p className="text-xs text-zinc-500 dark:text-zinc-400">
									Keep your account secure by using a strong password.
								</p>
							</div>
						</div>
						<Button
							onClick={() => setIsChangePasswordOpen(true)}
							className="w-full sm:w-auto rounded-xl font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 shadow-lg shadow-zinc-900/10"
						>
							Change Password
						</Button>
					</div>
				)}

				<div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
					<ActiveSessionList />
				</div>
			</div>

			<ChangePasswordModal
				isOpen={isChangePasswordOpen}
				onClose={() => setIsChangePasswordOpen(false)}
			/>
		</div>
	);
}
