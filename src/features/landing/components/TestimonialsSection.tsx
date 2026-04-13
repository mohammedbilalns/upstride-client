import { QuoteIcon, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "../data";

export default function TestimonialsSection() {
	return (
		<section
			id="testimonials"
			className="relative z-10 container mx-auto px-6 py-24"
		>
			<div className="text-center mb-16">
				<p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">
					Testimonials
				</p>
				<h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
					What Our Community Says
				</h2>
				<p className="text-lg text-muted-foreground max-w-xl mx-auto">
					Real stories from mentors and learners who've grown with UpStride.
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-6">
				{testimonials.map((testimonial) => (
					<Card
						key={testimonial.name}
						className="group border border-border/60 bg-card/70 backdrop-blur-md hover:border-primary/30
							transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
							rounded-2xl overflow-hidden"
					>
						<CardContent className="p-7 flex flex-col h-full">
							{/* Quote Icon */}
							<QuoteIcon className="h-7 w-7 text-primary/30 mb-4 shrink-0 group-hover:text-primary/50 transition-colors" />

							<p className="text-muted-foreground leading-relaxed mb-6 flex-1 italic text-sm">
								"{testimonial.content}"
							</p>

							{/* Stars */}
							<div className="flex mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star
										key={`${testimonial.name}-star-${i}`}
										className="h-4 w-4 text-(--rating) fill-(--rating)"
									/>
								))}
							</div>

							{/* Author */}
							<div className="flex items-center gap-3 pt-4 border-t border-border/50">
								<Avatar className="h-10 w-10 ring-2 ring-primary/10">
									<AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
										{testimonial.avatar}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-semibold text-sm">
										{testimonial.name}
									</div>
									<div className="text-xs text-muted-foreground">
										{testimonial.role}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
