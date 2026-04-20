import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import {
	ChevronRight,
	Flag,
	GraduationCap,
	LayoutDashboard,
	Library,
	LogOut,
	Users,
	Wallet,
	Zap,
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useLogout } from "@/features/authentication/hooks/mutations/useLogout";
import { cn } from "@/shared/utils/cn";
import { getInitials } from "@/shared/utils/getInitials";

interface AdminSidebarProps {
	isOpen?: boolean;
	onClose?: () => void;
}

export default function AdminSidebar({
	isOpen = true,
	onClose,
}: AdminSidebarProps) {
	const { auth } = useRouteContext({ from: "/_admin-layout" });
	const user = auth.user;
	const location = useLocation();
	const logoutMutation = useLogout();

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const navItems = [
		{
			to: "/dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
		},
		{
			to: "/user-management",
			label: "User Management",
			icon: Users,
		},
		{
			to: "/mentor-management",
			label: "Mentor Management",
			icon: GraduationCap,
		},
		{
			to: "/catalog-management",
			label: "Catalog Management",
			icon: Library,
			search: { tab: "interests" },
		},
		{
			to: "/report-management",
			label: "Report Management",
			icon: Flag,
		},
		{
			to: "/platform-transactions",
			label: "Platform Transactions",
			icon: Wallet,
		},
		...(user?.role === "SUPER_ADMIN"
			? [
					{
						to: "/admin-management",
						label: "Admin Management",
						icon: Users,
					},
				]
			: []),
	];

	return (
		<aside
			className={cn(
				"w-72 h-[calc(100vh-1.5rem)] fixed top-3 left-3 rounded-xl glass-dark shadow-soft flex flex-col pt-6 pb-4 animate-soft-in transition-transform duration-200 z-50",
				isOpen ? "translate-x-0" : "-translate-x-[110%]",
				"lg:translate-x-0",
			)}
		>
			{/* Brand Logo */}
			<div className="px-6 mb-10 flex items-start justify-between gap-3">
				<Link to="/dashboard" className="flex items-center gap-2.5 group">
					<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-all">
						<Zap className="h-5 w-5 text-primary-foreground" />
					</div>
					<span className="text-2xl font-bold tracking-tight">UpStride</span>
				</Link>
				<button
					type="button"
					onClick={onClose}
					className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Close sidebar"
				>
					<span className="text-xl leading-none">×</span>
				</button>
			</div>

			{/* Navigation Links */}
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
							{isActive && <ChevronRight className="h-4 w-4" />}
						</Link>
					);
				})}
			</nav>

			{/* Bottom Section */}
			<div className="px-4 mt-auto pt-6 space-y-6">
				<div className="flex justify-center border-t border-border/60 pt-6">
					<ThemeToggle />
				</div>

				{/* User Profile Info */}
				<div className="p-3 rounded-xl bg-muted/40 border border-border/40 backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10 border border-border/50 shadow-sm">
							<AvatarImage
								src={user?.profilePictureUrl || ""}
								alt={user?.name || "Admin"}
							/>
							<AvatarFallback className="bg-primary/10 text-primary font-semibold">
								{user?.name ? getInitials(user.name) : "AD"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col min-w-0">
							<span className="text-sm font-semibold truncate leading-none mb-1">
								{user?.name || "Administrator"}
							</span>
							<span className="text-xs text-muted-foreground font-medium bg-primary/5 px-1.5 py-0.5 rounded-md inline-block w-fit">
								{user?.role || "ADMIN"}
							</span>
						</div>
					</div>
				</div>

				{/* Logout Button */}
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
