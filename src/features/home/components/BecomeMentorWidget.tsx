import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";

export function BecomeMentorWidget() {
	return (
		<div className="rounded-xl bg-card border border-border p-6 flex flex-col items-center justify-center text-center space-y-4">
			<div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
				<GraduationCap className="h-6 w-6 text-primary" />
			</div>
			<h2 className="text-xl font-bold">Become a Mentor</h2>
			<p className="text-sm text-muted-foreground pb-2">
				Share your expertise and help others grow in their careers.
			</p>
			<Link
				to="/mentor/register"
				className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg flex items-center justify-center font-semibold transition-colors"
			>
				Register as Mentor
			</Link>
		</div>
	);
}
