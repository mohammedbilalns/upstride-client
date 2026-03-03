import { useRouter } from "@tanstack/react-router";
import { CheckCircle, ChevronRight, Heart, Zap } from "lucide-react";
import ThemeToggle from "@/components/common/Theme-Toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import FooterCTA from "@/features/landing/components/FooterCTA";
import HeroSection from "@/features/landing/components/HeroSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";

export default function LandingPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-background relative overflow-hidden">
			<div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

			{/*  Header  */}
			<header className="sticky top-0 z-50 border-b border-border/60 bg-background/95">
				<div className="container mx-auto px-6 h-16 flex justify-between items-center">
					{/* Logo */}
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/30">
							<Zap className="h-4 w-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold tracking-tight">UpStride</span>
					</div>

					{/* Nav */}
					<nav className="hidden md:flex items-center gap-8">
						{[
							{ href: "#features", label: "Features" },
							{ href: "#mentors", label: "Find Mentors" },
							{ href: "#testimonials", label: "Reviews" },
						].map(({ href, label }) => (
							<a
								key={href}
								href={href}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								{label}
							</a>
						))}
					</nav>

					{/* Actions */}
					<div className="flex items-center gap-3">
						<ThemeToggle />
						<Button
							onClick={() => router.navigate({ to: "/auth" })}
							className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold
								shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-px"
						>
							Get Started
						</Button>
					</div>
				</div>
			</header>

			{/* Hero  */}
			<HeroSection />

			{/*  Features  */}
			<FeaturesSection />

			{/*  Mentor CTA  */}
			<section className="relative z-10 container mx-auto px-6 py-8">
				<Card className="border border-primary/20 bg-primary/5 rounded-3xl overflow-hidden relative">
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_150%,hsl(var(--primary)/0.10),transparent)] pointer-events-none" />
					<CardContent className="relative z-10 p-12 md:p-16 text-center">
						<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
							<Heart className="h-7 w-7" />
						</div>
						<h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
							Share Your Expertise
						</h2>
						<p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
							Join our community of expert mentors and make a meaningful impact
							by guiding the next generation of professionals.
						</p>

						<div className="flex flex-wrap gap-6 justify-center items-center mb-10">
							{[
								"Flexible scheduling",
								"Earn while helping others",
								"Build your reputation",
							].map((perk) => (
								<div
									key={perk}
									className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
								>
									<CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
									{perk}
								</div>
							))}
						</div>

						<Button
							onClick={() => router.navigate({ to: "/home" })}
							size="lg"
							className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold
								text-base px-10 h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30
								transition-all duration-200 hover:-translate-y-0.5"
						>
							Register as a Mentor
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</CardContent>
				</Card>
			</section>

			{/*  Testimonials  */}
			<TestimonialsSection />

			{/*  Footer CTA  */}
			<FooterCTA />

			{/*  Footer  */}
			<footer className="relative z-10 border-t border-border/50">
				<div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
							<Zap className="h-3 w-3 text-primary-foreground" />
						</div>
						<span className="font-semibold text-foreground">UpStride</span>
					</div>
					<p>
						© 2025 Upstride. All rights reserved. Connecting mentors and
						learners worldwide.
					</p>
				</div>
			</footer>
		</div>
	);
}
