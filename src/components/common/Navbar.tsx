import { Link, useRouteContext } from "@tanstack/react-router";
import { Bell, LogOut, User as UserIcon, Zap } from "lucide-react";
import ThemeToggle from "@/components/common/Theme-Toggle";
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

export default function UserNavbar() {
	const { auth } = useRouteContext({ from: "/_user-layout" });
	const user = auth.user;
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

	const navLinks = [
		{ to: "/mentors", label: "Find Mentors" },
		{ to: "/articles", label: "Read Articles" },
		{ to: "/sessions", label: "Sessions" },
	];

	return (
		<header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-6 h-16 flex justify-between items-center">
				{/* Left Side: Logo and Navigation */}
				<div className="flex items-center gap-8">
					<Link to="/home" className="flex items-center gap-2.5 group">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/30 group-hover:shadow-primary/50 transition-all">
							<Zap className="h-4 w-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold tracking-tight">UpStride</span>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
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
				<div className="flex items-center gap-4">
					<div className="relative">
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full relative"
						>
							<Bell className="h-5 w-5 text-muted-foreground" />
							<Badge
								className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary"
								variant="default"
							>
								3
							</Badge>
						</Button>
					</div>

					<ThemeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-9 w-9 rounded-full">
								<Avatar className="h-9 w-9 border border-border/50">
									<AvatarImage
										src={user?.profilePictureUrl || ""}
										alt={user?.name || "User"}
									/>
									<AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
										{user?.name ? (
											getInitials(user.name)
										) : (
											<UserIcon className="h-4 w-4" />
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
									to="/profile"
									className="cursor-pointer w-full flex items-center"
								>
									<UserIcon className="mr-2 h-4 w-4" />
									<span>View Profile</span>
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
			</div>
		</header>
	);
}
