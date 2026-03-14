import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_user-layout/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto py-6 px-4 space-y-8">
			<section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-secondary/10 p-6 md:p-8 border border-border/50 shadow-xl animate-in fade-in zoom-in-95 duration-700">
				<div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

				<div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="max-w-xl space-y-6 text-center md:text-left">
						<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary animate-in slide-in-from-left-4 duration-1000">
							<GraduationCap className="h-4 w-4" />
							<span>Grow your career</span>
						</div>
						<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
							Become a <span className="text-primary">Mentor</span> today.
						</h1>
						<p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
							Share your journey, empower others, and build a lasting legacy.
							Join our community of elite mentors.
						</p>
						<div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
							<Link
								to="/mentor/register"
								className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 duration-300"
							>
								<span className="relative z-10 flex items-center gap-2">
									Register as Mentor
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</span>
								<div className="absolute inset-0 z-0 bg-linear-to-r from-primary via-primary/80 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
							</Link>
						</div>
					</div>

					<div className="w-full max-w-xs animate-in slide-in-from-right-4 duration-1000 hidden md:block">
						<div className="aspect-square rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 border border-border/50 shadow-inner flex items-center justify-center relative group overflow-hidden">
							<GraduationCap className="h-32 w-32 text-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
							<div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
						</div>
					</div>
				</div>
			</section>

			<div className="text-2xl font-semibold text-muted-foreground italic text-center opacity-50">
				Hello "/_authenticated/home"!
			</div>
		</div>
	);
}
