import { Link, useLocation } from "@tanstack/react-router";
import {
	Bookmark,
	CalendarClock,
	ChevronRight,
	FileText,
	LogOut,
	Repeat,
	ShieldCheck,
	User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useLogout } from "@/features/auth/hooks/mutations/useLogout";
import { cn } from "@/shared/utils/cn";

interface SidebarItem {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
	title: string;
	items: SidebarItem[];
}

interface ProfileSidebarProps {
	user: {
		name: string;
		email?: string;
		role: string;
		profilePictureUrl?: string | null;
	};
	isMentor: boolean;
}

export function ProfileSidebar({ user, isMentor }: ProfileSidebarProps) {
	const location = useLocation();
	const logoutMutation = useLogout();

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const sections: SidebarSection[] = [
		{
			title: "Account",
			items: [
				{
					to: "/profile",
					label: "My Profile",
					icon: User,
				},
				{
					to: "/profile/security",
					label: "Security",
					icon: ShieldCheck,
				},
				{
					to: "/profile/bookmarked-mentors",
					label: "Bookmarks",
					icon: Bookmark,
				},
			],
		},
		...(isMentor
			? [
					{
						title: "Mentoring",
						items: [
							{
								to: "/mentor-rule-management",
								label: "Rule Management",
								icon: Repeat,
							},
							{
								to: "/mentor-sessions",
								label: "Hosting Sessions",
								icon: CalendarClock,
							},
							{
								to: "/mentor-articles",
								label: "My Articles",
								icon: FileText,
							},
						],
					},
				]
			: []),
	];

	return (
		<div className="rounded-3xl border border-zinc-200/70 bg-background shadow-sm dark:border-zinc-800/80">
			<div className="flex flex-col gap-6 p-4 sm:p-5">
				<div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/90 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
					<div className="flex items-center gap-4">
						<Avatar className="h-12 w-12 border border-zinc-100 dark:border-zinc-800 shadow-sm">
							<AvatarImage src={user.profilePictureUrl || ""} alt={user.name} />
							<AvatarFallback className="bg-primary/10 text-primary font-bold">
								{user.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm leading-tight font-bold text-zinc-900 dark:text-zinc-50">
								{user.name}
							</p>
							<p className="mt-0.5 truncate text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
								{user.role}
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-8">
					{sections.map((section) => {
						if (section.items.length === 0) return null;

						return (
							<div key={section.title} className="space-y-3">
								<p className="px-2 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase dark:text-zinc-500">
									{section.title}
								</p>
								<nav className="flex flex-col gap-2">
									{section.items.map((item) => {
										const isActive = location.pathname === item.to;

										return (
											<Link
												key={item.to}
												to={item.to}
												className={cn(
													"group flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
													isActive
														? "border-primary/25 bg-primary/10 text-primary shadow-sm"
														: "border-zinc-200/70 bg-background text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-950 dark:hover:text-zinc-50",
												)}
											>
												<div className="flex min-w-0 items-center gap-3">
													<item.icon
														className={cn(
															"h-4.5 w-4.5 shrink-0 transition-colors",
															isActive
																? "text-primary"
																: "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300",
														)}
													/>
													<span className="truncate">{item.label}</span>
												</div>
												<ChevronRight
													className={cn(
														"h-3.5 w-3.5 shrink-0 transition-all",
														isActive
															? "translate-x-0 opacity-100"
															: "-translate-x-1 opacity-30 group-hover:translate-x-0 group-hover:opacity-60",
													)}
												/>
											</Link>
										);
									})}
								</nav>
							</div>
						);
					})}
				</div>

				<div className="border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
					<Button
						variant="ghost"
						className="h-11 w-full justify-start rounded-xl px-4 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
						onClick={handleLogout}
						disabled={logoutMutation.isPending}
					>
						<LogOut className="mr-3 h-4.5 w-4.5" />
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
}
