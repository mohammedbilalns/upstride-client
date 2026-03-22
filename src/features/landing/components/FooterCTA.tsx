import { useRouter } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FooterCTA() {
	const router = useRouter();
	return (
		<section className="relative z-10 container mx-auto px-6 py-28">
			<div className="relative rounded-3xl border border-primary/20 bg-primary text-primary-foreground px-8 py-16 text-center overflow-hidden">
				{/* Radial accent */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,hsl(var(--primary-foreground)/0.12),transparent)] pointer-events-none" />

				<div className="relative z-10">
					<div className="inline-flex items-center gap-2 border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm text-primary-foreground/90 font-medium mb-6 bg-primary-foreground/10">
						<Sparkles className="h-3.5 w-3.5" />
						Start for free today
					</div>

					<h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
						Ready to Start Your Journey?
					</h2>
					<p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed">
						Join thousands of learners and mentors who are already growing
						together on UpStride.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							onClick={() => router.navigate({ to: "/home" })}
							size="lg"
							className="cursor-pointer bg-primary-foreground text-primary font-semibold
								text-base px-10 h-12 rounded-xl shadow-lg shadow-primary-foreground/20 hover:shadow-primary-foreground/30
								transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
						>
							Get Started Today
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
						<Button
							onClick={() => router.navigate({ to: "/home" })}
							size="lg"
							variant="outline"
							className="cursor-pointer border-2 border-primary-foreground/30 text-base px-10 h-12
								rounded-xl font-semibold !bg-transparent !text-primary-foreground hover:!bg-primary-foreground/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
						>
							Learn More
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
