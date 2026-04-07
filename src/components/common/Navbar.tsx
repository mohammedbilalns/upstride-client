import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CoinBalanceLink from "@/components/common/CoinBalanceLink";
import DesktopNotifications from "@/components/common/DesktopNotifications";
import DesktopUserMenu from "@/components/common/DesktopUserMenu";
import MobileControls from "@/components/common/MobileControls";
import MobileMenu from "@/components/common/MobileMenu";
import MobileNotifications from "@/components/common/MobileNotifications";
import NavbarLinks from "@/components/common/NavbarLinks";
import NavbarLogo from "@/components/common/NavbarLogo";
import ThemeToggle from "@/components/common/Theme-Toggle";
import { useLogout } from "@/features/authentication/hooks/use-logout";
import { useCoinBalance } from "@/features/coin-management";
import { useGetUnreadCount } from "@/features/notifications/hooks";
import { profileQueryOptions } from "@/features/profile-management/hooks/use-profile";
import { cn } from "@/shared/utils/cn";
import { useQuery } from "@tanstack/react-query";

export const navLinks = [
	{ to: "/mentors", label: "Find Mentors" },
	{ to: "/articles", label: "Read Articles" },
	{ to: "/sessions", label: "Sessions" },
];

export type NavbarUser = {
	name?: string;
	role?: string;
	profilePictureUrl?: string;
} | null;

export default function UserNavbar() {
	const { auth } = useRouteContext({ from: "__root__" });
	const user = auth.user;
	const logoutMutation = useLogout();
	const { data: balance } = useCoinBalance();
	const coinBalance = balance?.coinBalance ?? 0;
	const { data: unreadData } = useGetUnreadCount();
	const unreadCount = unreadData?.count ?? 0;
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDesktopNotificationsOpen, setIsDesktopNotificationsOpen] =
		useState(false);
	const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] =
		useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	const { data: profile } = useQuery({
		...profileQueryOptions,
		enabled: Boolean(user?.id),
	});
	const mergedUser = user
		? {
				...user,
				name: profile?.name ?? user.name,
				profilePictureUrl: profile?.profilePictureUrl ?? user.profilePictureUrl,
			}
		: user;

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const handleCloseAll = () => {
		setIsMenuOpen(false);
		setIsDesktopNotificationsOpen(false);
		setIsMobileNotificationsOpen(false);
	};

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
					? "w-[calc(100%-4rem)] max-w-240 glass bg-background/80 border border-primary/20 shadow-lg backdrop-blur-xl"
					: "w-[calc(100%-2rem)] max-w-6xl bg-transparent border border-transparent shadow-none backdrop-blur-0",
			)}
		>
			<div className="mx-auto px-5 h-12 flex justify-between items-center">
				<div className="flex items-center gap-6">
					<NavbarLogo onNavigate={handleCloseAll} />
					<NavbarLinks links={navLinks} className="hidden md:flex" />
				</div>

				<div className="flex items-center gap-2 md:gap-4">
					<CoinBalanceLink
						coinBalance={coinBalance}
						className="hidden sm:flex"
					/>
					<DesktopNotifications
						isOpen={isDesktopNotificationsOpen}
						onOpenChange={setIsDesktopNotificationsOpen}
						unreadCount={unreadCount}
					/>
					<div className="hidden sm:block">
						<ThemeToggle />
					</div>
					<DesktopUserMenu user={mergedUser} onLogout={handleLogout} />

					<MobileControls
						isMenuOpen={isMenuOpen}
						onToggleMenu={() => {
							setIsMenuOpen(!isMenuOpen);
							setIsDesktopNotificationsOpen(false);
							setIsMobileNotificationsOpen(false);
						}}
					>
						<div className="sm:hidden">
							<ThemeToggle />
						</div>
						<MobileNotifications
							isOpen={isMobileNotificationsOpen}
							onOpenChange={setIsMobileNotificationsOpen}
							unreadCount={unreadCount}
						/>
					</MobileControls>
				</div>
			</div>

			<MobileMenu
				isOpen={isMenuOpen}
				links={navLinks}
				user={mergedUser}
				coinBalance={coinBalance}
				onClose={() => setIsMenuOpen(false)}
				onLogout={handleLogout}
			/>
		</header>
	);
}
