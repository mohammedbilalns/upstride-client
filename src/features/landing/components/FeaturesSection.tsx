import { useId } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { features } from "../data";

export default function FeaturesSection() {
	const baseId = useId();
	return (
		<section
			id={`features-${baseId}`}
			className="relative z-10 container mx-auto px-6 py-20"
		>
			<div className="text-center mb-16">
				<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
					Why Choose UpStride?
				</h2>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Everything you need to connect with mentors and accelerate your
					professional growth.
				</p>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{features.map((feature) => (
					<Card
						key={feature.title}
						className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
					>
						<CardHeader>
							<div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
								{feature.icon}
							</div>
							<CardTitle className="text-xl">{feature.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-base leading-relaxed">
								{feature.description}
							</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
