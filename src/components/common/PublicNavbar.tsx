import { Link, useRouter } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/common/Theme-Toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils/cn";

export default function PublicNavbar() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	const navLinks = [
		{ href: "#features", label: "Features" },
		{ href: "#mentors", label: "Find Mentors" },
		{ href: "#testimonials", label: "Reviews" },
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
						to="/"
						className="flex items-center gap-2 group"
						onClick={() => setIsMenuOpen(false)}
					>
						<div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/30 group-hover:shadow-primary/50 transition-all">
							<Zap className="h-3.5 w-3.5 text-primary-foreground" />
						</div>
						<span className="text-lg font-bold tracking-tight">UpStride</span>
					</Link>

					<nav className="hidden md:flex items-center gap-7">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
							>
								{link.label}
							</a>
						))}
					</nav>
				</div>

				{/* Right Side: Actions */}
				<div className="flex items-center gap-2 md:gap-3">
					<div className="hidden sm:block">
						<ThemeToggle />
					</div>
					<Button
						onClick={() => router.navigate({ to: "/auth" })}
						className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold h-9 px-4 text-xs md:text-sm
							shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-px active:scale-[0.98]"
					>
						Get Started
					</Button>

					{/* Mobile Menu Toggle */}
					<div className="flex items-center gap-2 md:hidden">
						<div className="sm:hidden">
							<ThemeToggle />
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
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
							<a
								key={link.href}
								href={link.href}
								onClick={() => setIsMenuOpen(false)}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all px-2 py-1.5 rounded-lg hover:bg-primary/5"
							>
								{link.label}
							</a>
						))}
					</nav>

					<div className="h-px bg-border/40 my-1" />

					<Button
						onClick={() => {
							setIsMenuOpen(false);
							router.navigate({ to: "/auth" });
						}}
						className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold py-5
							shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
					>
						Get Started
					</Button>
				</div>
			)}
		</header>
	);
}
