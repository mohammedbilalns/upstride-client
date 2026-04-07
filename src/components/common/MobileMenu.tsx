import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import CoinBalanceLink from "@/components/common/CoinBalanceLink";
import NavbarLinks from "@/components/common/NavbarLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/shared/utils/get-initials";
import type { NavbarUser, navLinks } from "./Navbar";

type NavLinkItem = (typeof navLinks)[number];

export default function MobileMenu({
	isOpen,
	links,
	user,
	coinBalance,
	onClose,
	onLogout,
}: {
	isOpen: boolean;
	links: NavLinkItem[];
	user: NavbarUser;
	coinBalance: number;
	onClose: () => void;
	onLogout: () => void;
}) {
	if (!isOpen) return null;

	return (
		<div className="md:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-background border border-border/80 rounded-xl py-4 px-5 space-y-4 animate-soft-in overflow-hidden shadow-2xl">
			<NavbarLinks
				links={links}
				onNavigate={onClose}
				className="flex-col items-start gap-3"
				linkClassName="text-muted-foreground hover:text-foreground transition-all px-2 py-1.5 rounded-lg hover:bg-primary/5"
			/>

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
					<CoinBalanceLink
						coinBalance={coinBalance}
						onNavigate={onClose}
						className="gap-1.5 px-2.5 py-1 text-xs"
					/>
				</div>

				<div className="flex flex-col gap-2 mt-2">
					<Button
						variant="outline"
						size="sm"
						className="w-full justify-start text-xs h-9 rounded-lg"
						asChild
					>
						<Link
							to={user?.role === "MENTOR" ? "/mentor-dashboard" : "/profile"}
							onClick={onClose}
						>
							<LayoutDashboard className="mr-2 h-3.5 w-3.5" />
							Dashboard
						</Link>
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="w-full justify-start text-xs h-9 rounded-lg"
						onClick={onLogout}
					>
						<LogOut className="mr-2 h-3.5 w-3.5 text-destructive" />
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
}
