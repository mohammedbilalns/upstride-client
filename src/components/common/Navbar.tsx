import { Link, useRouteContext } from "@tanstack/react-router";
import {
	Bell,
	Coins,
	LayoutDashboard,
	LogOut,
	Menu,
	User as UserIcon,
	X,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/common/Theme-Toggle";
import { cn } from "@/shared/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { useCoinBalance } from "@/features/coin-management";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { useGetUnreadCount } from "@/features/notifications/hooks";

export default function UserNavbar() {
	const { auth } = useRouteContext({ from: "__root__" });
	const user = auth.user;
	const logoutMutation = useLogout();
	const { data: balance } = useCoinBalance();
	const coinBalance = balance?.coinBalance ?? 0;
	const { data: unreadData } = useGetUnreadCount();
	const unreadCount = unreadData?.count ?? 0;
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

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

	const navLinks = [
		{ to: "/mentors", label: "Find Mentors" },
		{ to: "/articles", label: "Read Articles" },
		{ to: "/sessions", label: "Sessions" },
	];

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 12);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-3 left-1/2 -translate-x-1/2 z-50 rounded-xl animate-soft-in transition-all duration-300",
				isScrolled
					? "w-[calc(100%-3.5rem)] max-w-5xl glass bg-background/80 border border-primary/20 shadow-lg backdrop-blur-xl"
					: "w-[calc(100%-2rem)] max-w-6xl bg-transparent border border-transparent shadow-none backdrop-blur-0",
			)}
		>
			<div className="mx-auto px-5 h-12 flex justify-between items-center">
				{/* Left Side: Logo and Navigation */}
				<div className="flex items-center gap-6">
					<Link
						to="/home"
						className="flex items-center gap-2 group"
						onClick={() => {
							setIsMenuOpen(false);
							setIsNotificationsOpen(false);
						}}
					>
						<div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/30 group-hover:shadow-primary/50 transition-all">
							<Zap className="h-3.5 w-3.5 text-primary-foreground" />
						</div>
						<span className="text-lg font-bold tracking-tight">UpStride</span>
					</Link>

					<nav className="hidden md:flex items-center gap-5">
						{navLinks.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								activeProps={{
									className: "text-foreground font-semibold",
								}}
								inactiveProps={{
									className: "text-muted-foreground hover:text-foreground",
								}}
								className="text-sm font-medium transition-colors"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				{/* Right Side: Actions */}
				<div className="flex items-center gap-2 md:gap-4">
					<Link
						to="/coins"
						search={{
							tab: "coins",
							coinPage: 1,
							coinLimit: 10,
							coinSort: "recent",
							paymentPage: 1,
							paymentLimit: 10,
							paymentSort: "recent",
						}}
						className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs md:text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
					>
						<Coins className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
						<span className="tabular-nums">{coinBalance}</span>
					</Link>

					<div className="hidden sm:block">
						<DropdownMenu
							open={isNotificationsOpen}
							onOpenChange={setIsNotificationsOpen}
							modal={false}
						>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"rounded-full relative h-8 w-8 md:h-9 md:w-9 transition-colors",
										isNotificationsOpen && "bg-accent text-accent-foreground",
									)}
								>
									<Bell className="h-4.5 w-4.5 md:h-5 md:w-5 text-muted-foreground" />
									{unreadCount > 0 && (
										<Badge
											className="absolute -top-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center p-0 text-[9px] md:text-[10px] bg-primary"
											variant="default"
										>
											{unreadCount > 99 ? "99+" : unreadCount}
										</Badge>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-80 md:w-[22rem] p-0 border-border/80 shadow-2xl rounded-xl"
								align="end"
								sideOffset={8}
							>
								<NotificationDropdown
									onClose={() => setIsNotificationsOpen(false)}
								/>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="hidden sm:block">
						<ThemeToggle />
					</div>

					<div className="hidden md:block">
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 md:h-9 md:w-9 rounded-full"
								>
									<Avatar className="h-8 w-8 md:h-9 md:w-9 border border-border/50">
										<AvatarImage
											src={user?.profilePictureUrl || ""}
											alt={user?.name || "User"}
										/>
										<AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs text-[10px] md:text-xs">
											{user?.name ? (
												getInitials(user.name)
											) : (
												<UserIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
											)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user?.name}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user?.role}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link
										to={
											user?.role === "MENTOR" ? "/mentor-dashboard" : "/profile"
										}
										className="cursor-pointer w-full flex items-center"
									>
										<LayoutDashboard className="mr-2 h-4 w-4" />
										<span>Dashboard</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="cursor-pointer text-destructive focus:text-destructive"
									onClick={handleLogout}
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Mobile Menu Toggle & Notifications */}
					<div className="flex items-center gap-1 md:hidden">
						<div className="sm:hidden">
							<ThemeToggle />
						</div>

						<div>
							<DropdownMenu onOpenChange={setIsNotificationsOpen} modal={false}>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className={cn(
											"h-8 w-8 rounded-lg",
											isNotificationsOpen && "bg-accent text-accent-foreground",
										)}
									>
										<Bell className="h-5 w-5 text-muted-foreground" />
										{unreadCount > 0 && (
											<Badge
												className="absolute 0 right-0 h-3 w-3 flex items-center justify-center p-0 text-[8px] bg-primary"
												variant="default"
											>
												{unreadCount > 99 ? "99+" : unreadCount}
											</Badge>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[calc(100vw-2rem)] max-w-sm mr-4 p-0 border-border/80 shadow-2xl rounded-xl"
									align="end"
									sideOffset={8}
								>
									<NotificationDropdown />
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								setIsMenuOpen(!isMenuOpen);
								setIsNotificationsOpen(false);
							}}
							className="h-8 w-8 rounded-lg"
						>
							{isMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Dropdown */}
			{isMenuOpen && (
				<div className="md:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-background border border-border/80 rounded-xl py-4 px-5 space-y-4 animate-soft-in overflow-hidden shadow-2xl">
					<nav className="flex flex-col gap-3">
						{navLinks.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								onClick={() => setIsMenuOpen(false)}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all px-2 py-1.5 rounded-lg hover:bg-primary/5"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="h-px bg-border/40 my-2" />

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between px-2">
							<div className="flex items-center gap-3">
								<Avatar className="h-8 w-8 border border-border/50">
									<AvatarImage
										src={user?.profilePictureUrl || ""}
										alt={user?.name || "User"}
									/>
									<AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px]">
										{user?.name ? (
											getInitials(user.name)
										) : (
											<UserIcon className="h-3.5 w-3.5" />
										)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-medium">{user?.name}</span>
									<span className="text-[10px] text-muted-foreground">
										{user?.role}
									</span>
								</div>
							</div>
							<Link
								to="/coins"
								search={{
									tab: "coins",
									coinPage: 1,
									coinLimit: 10,
									coinSort: "recent",
									paymentPage: 1,
									paymentLimit: 10,
									paymentSort: "recent",
								}}
								onClick={() => setIsMenuOpen(false)}
								className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-xs font-semibold text-foreground"
							>
								<Coins className="h-3.5 w-3.5 text-primary" />
								<span>{coinBalance}</span>
							</Link>
						</div>

						<div className="flex flex-col gap-2 mt-2">
							<Button
								variant="outline"
								size="sm"
								className="w-full justify-start text-xs h-9 rounded-lg"
								asChild
							>
								<Link
									to={
										user?.role === "MENTOR" ? "/mentor-dashboard" : "/profile"
									}
									onClick={() => setIsMenuOpen(false)}
								>
									<LayoutDashboard className="mr-2 h-3.5 w-3.5" />
									Dashboard
								</Link>
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="w-full justify-start text-xs h-9 rounded-lg"
								onClick={handleLogout}
							>
								<LogOut className="mr-2 h-3.5 w-3.5 text-destructive" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
