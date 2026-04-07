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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { cn } from "@/shared/utils/cn";

interface SidebarItem {
	to: string;
	label: string;
	icon: any;
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
								label: "Mentor Sessions",
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
		<div className="flex flex-col gap-6">
			{/* User Summary Card */}
			<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-5 flex items-center gap-4">
				<Avatar className="h-12 w-12 border border-zinc-100 dark:border-zinc-800 shadow-sm">
					<AvatarImage src={user.profilePictureUrl || ""} alt={user.name} />
					<AvatarFallback className="bg-primary/10 text-primary font-bold">
						{user.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate leading-tight">
						{user.name}
					</p>
					<p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
						{user.role}
					</p>
				</div>
			</div>

			{/* Navigation Sections */}
			<div className="flex flex-col gap-8 flex-1">
				{sections.map(
					(section) =>
						section.items.length > 0 && (
							<div key={section.title} className="space-y-3">
								<p className="px-4 text-[10px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase">
									{section.title}
								</p>
								<nav className="flex flex-col gap-1">
									{section.items.map((item) => {
										const isActive = location.pathname === item.to;
										return (
											<Link
												key={item.to}
												to={item.to}
												className={cn(
													"flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
													isActive
														? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
														: "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-50",
												)}
											>
												<div className="flex items-center gap-3">
													<item.icon
														className={cn(
															"h-4.5 w-4.5 transition-colors",
															isActive
																? "text-primary"
																: "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
														)}
													/>
													{item.label}
												</div>
												<ChevronRight
													className={cn(
														"h-3.5 w-3.5 transition-all opacity-0 -translate-x-2",
														isActive
															? "opacity-100 translate-x-0"
															: "group-hover:opacity-40 group-hover:translate-x-0",
													)}
												/>
											</Link>
										);
									})}
								</nav>
							</div>
						),
				)}
			</div>

			{/* Sidebar Footer */}
			<div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-2">
				<Button
					variant="ghost"
					className="w-full justify-start h-11 px-4 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
					onClick={handleLogout}
					disabled={logoutMutation.isPending}
				>
					<LogOut className="h-4.5 w-4.5 mr-3" />
					Logout
				</Button>
			</div>
		</div>
	);
}
