import { Link } from "@tanstack/react-router";
import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/shared/utils/get-initials";
import type { NavbarUser } from "./Navbar";

export default function DesktopUserMenu({
	user,
	onLogout,
}: {
	user: NavbarUser;
	onLogout: () => void;
}) {
	return (
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
							<p className="text-sm font-medium leading-none">{user?.name}</p>
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
							<span>My Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-destructive focus:text-destructive"
						onClick={onLogout}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
