import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface ErrorComponentProps {
	error?: Error;
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
	const router = useRouter();

	return (
		<div className="relative min-h-[92vh] flex flex-col justify-center items-center p-6 overflow-hidden bg-slate-950 text-white">
			{/* Decorative background elements */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ duration: 1.5 }}
				className="absolute inset-0 z-0"
			>
				<motion.div
					animate={{
						x: [0, -100, 0],
						y: [0, 50, 0],
					}}
					transition={{
						duration: 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-red-600/20 blur-3xl"
				/>
				<motion.div
					animate={{
						x: [0, 100, 0],
						y: [0, -50, 0],
					}}
					transition={{
						duration: 25,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl"
				/>
			</motion.div>

			{/* Content Card */}
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="relative z-10 w-full max-w-lg"
			>
				<div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-10 md:p-14 text-center shadow-2xl overflow-hidden group">
					{/* Glowing top line */}
					<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/50 to-transparent" />

					{/* Icon with alert animation */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							delay: 0.1,
						}}
						className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 mb-8 relative"
					>
						<AlertCircle className="w-10 h-10 text-red-400" />
						<motion.div
							animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
							transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
							className="absolute inset-0 rounded-full bg-red-400"
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<h1 className="text-5xl font-black mb-4 bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
							Something went wrong
						</h1>
						<p className="text-slate-400 text-lg leading-relaxed mb-6 mx-auto">
							{error?.message ||
								"An unexpected error has occurred. Please try again later."}
						</p>

						{error?.stack && (
							<div className="mb-10 p-4 bg-black/40 rounded-xl border border-white/5 text-left overflow-auto max-h-32 text-xs font-mono text-slate-500 scrollbar-hide">
								{error.stack}
							</div>
						)}
					</motion.div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<button
								onClick={() => router.invalidate()}
								className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 shadow-lg"
							>
								<RefreshCw className="w-5 h-5" />
								<span>Try Again</span>
							</button>
						</motion.div>

						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<Link
								to="/"
								className="w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-500 transition-all duration-300 shadow-lg shadow-red-500/25 active:shadow-none overflow-hidden"
							>
								<div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
								<Home className="w-5 h-5" />
								<span>Return Home</span>
							</Link>
						</motion.div>
					</div>
				</div>
			</motion.div>

			{/* Background Overlay */}
			<div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
		</div>
	);
}
