import { Link } from "@tanstack/react-router";
import { Home, Search } from "lucide-react";
import { motion } from "motion/react";

export default function NotFoundComponent() {
	return (
		<div className="relative min-h-[92vh] flex flex-col justify-center items-center p-6 overflow-hidden bg-slate-950">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ duration: 1.5 }}
				className="absolute inset-0 z-0"
			>
				<motion.div
					animate={{
						x: [0, 100, 0],
						y: [0, -50, 0],
					}}
					transition={{
						duration: 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"
				/>
				<motion.div
					animate={{
						x: [0, -100, 0],
						y: [0, 50, 0],
					}}
					transition={{
						duration: 25,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
				/>
			</motion.div>

			{/* Content Card */}
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="relative z-10 w-full max-w-lg"
			>
				<div className="bg-white/3 backdrop-blur-2xl rounded-3xl border border-white/10 p-10 md:p-14 text-center shadow-2xl overflow-hidden group">
					{/* Glowing top line */}
					<div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

					{/* Icon with searching animation */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							delay: 0.1,
						}}
						className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 relative"
					>
						<Search className="w-10 h-10 text-blue-400" />
						<motion.div
							animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
							transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
							className="absolute inset-0 rounded-full bg-blue-400"
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<h1 className="text-7xl font-black mb-4 bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
							404
						</h1>
						<h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
							Page Not Found
						</h2>
						<p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-[280px] mx-auto">
							Oops! It seems you've wandered into uncharted territory.
						</p>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="inline-block"
					>
						<Link
							to="/"
							className="group relative flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25 active:shadow-none overflow-hidden"
						>
							<div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
							<Home className="w-5 h-5" />
							<span>Return Home</span>
						</Link>
					</motion.div>
				</div>
			</motion.div>

			{/* Background Overlay */}
			<div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
		</div>
	);
}
