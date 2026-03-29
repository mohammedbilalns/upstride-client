import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import {
	CalendarClock,
	LayoutDashboard,
	LogOut,
	Repeat,
	Undo2,
	Zap,
} from "lucide-react";
import ThemeToggle from "@/components/common/Theme-Toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { cn } from "@/shared/utils/cn";

export default function MentorSidebar() {
	const { auth } = useRouteContext({ from: "/_app-layout/_mentor-layout" });
	const user = auth.user;
	const location = useLocation();
	const logoutMutation = useLogout();

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	const navItems = [
		{
			to: "/mentor-dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
		},
		{
			to: "/mentor-sessions",
			label: "Upcoming Sessions",
			icon: CalendarClock,
		},
		{
			to: "/mentor-rule-management",
			label: "Rule Management",
			icon: Repeat,
		},
		{
			to: "/mentor-slot-management",
			label: "Slot Management",
			icon: CalendarClock,
		},
	];

	return (
		<aside className="w-72 h-[calc(100vh-1.5rem)] sticky top-3 m-3 rounded-xl glass-dark shadow-soft flex flex-col pt-6 pb-4 animate-soft-in">
			<div className="px-6 mb-10">
				<Link
					to="/mentor-dashboard"
					className="flex items-center gap-2.5 group"
				>
					<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-all">
						<Zap className="h-5 w-5 text-primary-foreground" />
					</div>
					<span className="text-2xl font-bold tracking-tight">UpStride</span>
				</Link>
			</div>

			<nav className="flex-1 px-4 space-y-1.5">
				{navItems.map((item) => {
					const isActive = location.pathname === item.to;
					return (
						<Link
							key={item.to}
							to={item.to}
							className={cn(
								"flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
								isActive
									? "bg-primary/10 text-primary shadow-sm"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<div className="flex items-center gap-3">
								<item.icon
									className={cn(
										"h-5 w-5 transition-colors",
										isActive ? "text-primary" : "group-hover:text-foreground",
									)}
								/>
								{item.label}
							</div>
						</Link>
					);
				})}
			</nav>

			<div className="px-4 mt-2">
				<Link
					to="/home"
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
						"text-muted-foreground hover:bg-muted hover:text-foreground",
					)}
				>
					<Undo2 className="h-5 w-5" />
					Back to Home
				</Link>
			</div>

			<div className="px-4 mt-auto pt-6 space-y-6">
				<div className="flex justify-center border-t border-border/60 pt-6">
					<ThemeToggle />
				</div>

				<div className="p-3 rounded-xl bg-muted/40 border border-border/40 backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10 border border-border/50 shadow-sm">
							<AvatarImage
								src={user?.profilePictureUrl || ""}
								alt={user?.name || "Mentor"}
							/>
							<AvatarFallback className="bg-primary/10 text-primary font-semibold">
								{user?.name ? getInitials(user.name) : "ME"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col min-w-0">
							<span className="text-sm font-semibold truncate leading-none mb-1">
								{user?.name || "Mentor"}
							</span>
							<span className="text-xs text-muted-foreground font-medium bg-primary/5 px-1.5 py-0.5 rounded-md inline-block w-fit">
								{user?.role || "MENTOR"}
							</span>
						</div>
					</div>
				</div>

				<Button
					variant="outline"
					className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive border-border/60"
					onClick={handleLogout}
					disabled={logoutMutation.isPending}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</Button>
			</div>
		</aside>
	);
}
