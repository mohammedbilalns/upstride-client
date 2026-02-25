import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function FooterCTA() {
	const router = useRouter();
	return (
		<section className="relative z-10 container mx-auto px-6 py-20 text-center">
			<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
				Ready to Start Your Journey?
			</h2>
			<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
				Join thousands of learners and mentors who are already growing together
				on SkillShare.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					onClick={() => router.navigate({ to: "/home" })}
					size="lg"
					className="cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-lg px-8 py-6"
				>
					Get Started Today
				</Button>
				<Button
					onClick={() => router.navigate({ to: "/home" })}
					size="lg"
					variant="outline"
					className="cursor-pointer text-lg px-8 py-6"
				>
					Learn More
				</Button>
			</div>
		</section>
	);
}
