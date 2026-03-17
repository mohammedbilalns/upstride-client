import { Link } from "@tanstack/react-router";
import { Home, Search } from "lucide-react";

export default function NotFoundComponent() {
	return (
		<div className="relative min-h-[92vh] flex flex-col justify-center items-center p-6 overflow-hidden bg-background text-foreground">
			<div className="absolute inset-0 z-0 opacity-30">
				<div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl" />
				<div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
			</div>

			{/* Content Card */}
			<div className="relative z-10 w-full max-w-lg">
				<div className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-border/60 p-10 md:p-14 text-center shadow-2xl overflow-hidden">
					{/* Glowing top line */}
					<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

					<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/20 mb-8 relative">
						<Search className="w-10 h-10 text-primary" />
						<div className="absolute inset-0 rounded-full bg-primary/10" />
					</div>

					<div>
						<h1 className="text-7xl font-black mb-4 bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
							404
						</h1>
						<h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight">
							Page unavailable
						</h2>
						<p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-70 mx-auto">
							The page you are looking for might have moved, been removed, or is
							temporarily unavailable.
						</p>
					</div>

					<div className="inline-block">
						<Link
							to="/"
							className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg shadow-primary/25"
						>
							<Home className="w-5 h-5" />
							<span>Return Home</span>
						</Link>
					</div>
				</div>
			</div>

			<div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] bg-size-[18px_18px]" />
		</div>
	);
}
