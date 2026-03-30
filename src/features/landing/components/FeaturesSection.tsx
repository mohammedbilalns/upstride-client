import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { features } from "../data";

export default function FeaturesSection() {
	return (
		<section
			id="features"
			className="relative z-10 container mx-auto px-6 py-24"
		>
			<div className="text-center mb-16">
				<p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
					Why UpStride
				</p>
				<h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
					Everything You Need to Grow
				</h2>
				<p className="text-lg text-muted-foreground max-w-xl mx-auto">
					From finding the perfect mentor to tracking your progress — UpStride
					has you covered every step of the way.
				</p>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
				{features.map((feature) => (
					<Card
						key={feature.title}
						className="group relative border border-border/60 bg-gradient-to-b from-card to-muted/40 backdrop-blur-sm hover:border-primary/40
							transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5
							rounded-2xl overflow-hidden"
					>
						{/* Top accent bar */}
						<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						<CardHeader className="pb-2">
							<div
								className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary
									group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300"
							>
								{feature.icon}
							</div>
							<CardTitle className="text-lg font-semibold">
								{feature.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-sm leading-relaxed text-muted-foreground">
								{feature.description}
							</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
