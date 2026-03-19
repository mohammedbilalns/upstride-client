import { Link } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorComponentProps {
	error?: Error;
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
	return (
		<div className="relative min-h-[92vh] flex flex-col justify-center items-center p-6 overflow-hidden bg-background text-foreground">
			<div className="absolute inset-0 z-0 opacity-30">
				<div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-red-500/15 blur-3xl" />
				<div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl" />
			</div>

			{/* Content Card */}
			<div className="relative z-10 w-full max-w-lg">
				<div className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-border/60 p-10 md:p-14 text-center shadow-2xl overflow-hidden">
					{/* Glowing top line */}
					<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-destructive/40 to-transparent" />

					{/* Icon with alert animation */}
					<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 border border-destructive/20 mb-8 relative">
						<AlertCircle className="w-10 h-10 text-destructive" />
						<div className="absolute inset-0 rounded-full bg-destructive/10" />
					</div>

					<div>
						<h1 className="text-5xl font-black mb-4 bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
							Something went wrong
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed mb-6 mx-auto">
							{error?.message ||
								"An unexpected error has occurred. Please try again later."}
						</p>

						{error?.stack && (
							<div className="mb-10 p-4 bg-muted/40 rounded-xl border border-border/60 text-left overflow-auto max-h-32 text-xs font-mono text-muted-foreground scrollbar-hide">
								{error.stack}
							</div>
						)}
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-muted text-foreground font-semibold rounded-2xl border border-border/60 shadow-lg"
						>
							<RefreshCw className="w-5 h-5" />
							<span>Try Again</span>
						</button>

						<Link
							to="/"
							className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-destructive text-destructive-foreground font-semibold rounded-2xl shadow-lg shadow-destructive/25"
						>
							<Home className="w-5 h-5" />
							<span>Return Home</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Background Overlay */}
			<div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] [background-size:18px_18px]" />
		</div>
	);
}
