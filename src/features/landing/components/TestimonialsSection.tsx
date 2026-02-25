import { Star } from "lucide-react";
import { useId } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "../data";

export default function TestimonialsSection() {
	const baseId = useId();
	return (
		<section
			id={`testimonials-${baseId}`}
			className="relative z-10 container mx-auto px-6 py-20"
		>
			<div className="text-center mb-16">
				<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
					What Our Community Says
				</h2>
				<p className="text-xl text-muted-foreground">
					Real stories from mentors and learners who've grown with SkillShare.
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-6">
				{testimonials.map((testimonial) => (
					<Card
						key={testimonial.name}
						className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50"
					>
						<CardContent className="p-6">
							<div className="flex items-center mb-4">
								<Avatar className="mr-3">
									<AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
										{testimonial.avatar}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-semibold">{testimonial.name}</div>
									<div className="text-sm text-muted-foreground">
										{testimonial.role}
									</div>
								</div>
							</div>
							<p className="text-muted-foreground mb-4">
								{testimonial.content}
							</p>
							<div className="flex">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star
										key={`${testimonial.name}-star-${i}`}
										className="h-4 w-4 text-yellow-500 fill-current"
									/>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
