import { motion } from "motion/react";

interface PendingComponentProps {
	resource?: string;
}

export default function PendingComponent({ resource }: PendingComponentProps) {
	return (
		<div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-background/80 backdrop-blur-md">
			<div className="relative flex flex-col items-center gap-6">
				{/*  Spinner */}
				<div className="relative w-12 h-12">
					<div className="absolute inset-0 border-2 border-primary/10 rounded-full" />
					<div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
				</div>

				{/*  Dynamic Text */}
				<div className="flex flex-col items-center gap-2">
					<span className="text-xs font-semibold text-primary uppercase tracking-[0.2em] animate-pulse">
						{resource ? `Loading ${resource}...` : "Loading..."}
					</span>

					{/* Progress Dots */}
					<div className="flex gap-1">
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								animate={{ opacity: [0.3, 1, 0.3] }}
								transition={{
									duration: 1.2,
									repeat: Number.POSITIVE_INFINITY,
									delay: i * 0.2,
								}}
								className="w-1 h-1 rounded-full bg-primary/40"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
