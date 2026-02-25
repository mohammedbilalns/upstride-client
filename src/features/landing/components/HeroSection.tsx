import { useRouter } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stats } from "../data";

export default function HeroSection() {
	const router = useRouter();
	return (
		<section className="relative z-10 container mx-auto px-6 py-20 text-center">
			<Badge className="mb-6 bg-linear-to-r from-primary/10 to-secondary/10 text-foreground border-primary/20">
				🚀 Join 10,000+ learners growing their skills
			</Badge>

			<h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent leading-tight">
				Connect with Expert
				<br />
				<span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
					Mentors & Grow
				</span>
			</h1>

			<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
				Accelerate your career with personalized mentorship from industry
				experts. Learn, grow, and achieve your professional goals with guidance
				from those who've been there.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
				<Button
					onClick={() => router.navigate({ to: "/home" })}
					size="lg"
					className=" cursor-pointer bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6"
				>
					Find Your Mentor
					<ArrowRight className="ml-2 h-5 w-5" />
				</Button>

				<Button
					size="lg"
					variant="outline"
					onClick={() => router.navigate({ to: "/auth" })}
					className=" cursor-pointer border-2 border-primary/30 hover:bg-primary/10 text-lg px-8 py-6 bg-linear-to-r from-card/80 to-card/60 backdrop-blur-sm"
				>
					<Users className="mr-2 h-5 w-5" />
					Become a Mentor
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
				{stats.map((stat) => (
					<div key={stat.number} className="text-center">
						<div className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
							{stat.number}
						</div>
						<div className="text-sm text-muted-foreground">{stat.label}</div>
					</div>
				))}
			</div>
		</section>
	);
}
