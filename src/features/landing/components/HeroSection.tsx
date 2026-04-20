import { useRouter } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { stats } from "../data";

export default function HeroSection() {
	const router = useRouter();
	return (
		<section className="relative z-10 container mx-auto px-6 pt-28 pb-28 text-center animate-soft-in">
			{/* Subtle noise/grid overlay */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)] -z-10" />

			<Badge
				className="mb-8 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20 rounded-full
					shadow-sm hover:bg-primary/15 transition-colors"
			>
				🚀 Join 10,000+ learners growing their skills
			</Badge>

			<h1 className="text-5xl md:text-7xl font-extrabold mb-5 tracking-tight leading-[1.1] text-foreground">
				Connect with Expert
				<br />
				<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
					Mentors &amp; Grow
				</span>
			</h1>

			<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-5">
				<span className="text-(--rating)">★</span>
				<span className="font-medium text-foreground">4.9</span>
				<span>rating from 2000+ users</span>
			</div>

			<p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
				Accelerate your career with personalized mentorship from industry
				experts. Learn, grow, and achieve your goals with those who've been
				there.
			</p>

			<div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mb-6">
				<span>⭐ 4.9</span>
				<span>Trusted by 10,000+ learners</span>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
				<Button
					onClick={() => router.navigate({ to: "/home" })}
					size="lg"
					className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold
						text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30
						transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
				>
					Find Your Mentor
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>

				<Button
					size="lg"
					variant="outline"
					onClick={() => router.navigate({ to: "/auth" })}
					className="cursor-pointer border-2 border-primary/25 hover:border-primary/50 text-base px-8 h-12 rounded-xl
						font-semibold hover:bg-primary/5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
				>
					<Users className="mr-2 h-4 w-4" />
					Become a Mentor
				</Button>
			</div>

			<div className="mt-16 flex justify-center">
				<div className="glass rounded-2xl p-5 shadow-soft-xl border border-border/40" />
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto border-t border-border/50 pt-10">
				{stats.map((stat) => (
					<div key={stat.number} className="text-center group">
						<div
							className="text-3xl font-bold bg-linear-to-br from-primary to-primary/70 bg-clip-text text-transparent
								mb-1 group-hover:scale-110 transition-transform duration-200"
						>
							{stat.number}
						</div>
						<div className="text-sm text-muted-foreground font-medium">
							{stat.label}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
