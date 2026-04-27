import { Link } from "@tanstack/react-router";
import { cn } from "@/shared/utils/cn";

type NavLinkItem = {
	to: string;
	label: string;
};

export default function NavbarLinks({
	links,
	onNavigate,
	className,
	linkClassName,
	activeClassName,
	inactiveClassName,
}: {
	links: NavLinkItem[];
	onNavigate?: () => void;
	className?: string;
	linkClassName?: string;
	activeClassName?: string;
	inactiveClassName?: string;
}) {
	return (
		<nav className={cn("flex items-center gap-5", className)}>
			{links.map((link) => (
				<Link
					key={link.to}
					to={link.to}
					onClick={onNavigate}
					activeProps={{
						className: activeClassName ?? "text-foreground font-semibold",
					}}
					inactiveProps={{
						className:
							inactiveClassName ??
							"text-muted-foreground hover:text-foreground",
					}}
					className={cn("text-sm font-medium transition-colors", linkClassName)}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
