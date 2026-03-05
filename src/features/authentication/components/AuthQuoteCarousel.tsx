import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

const QUOTES = [
	{
		line1: "The best investment",
		line2: "you can make",
		line3: "is in yourself.",
		author: "WARREN BUFFETT",
	},
	{
		line1: "The right guidance",
		line2: "can turn potential",
		line3: "into reality.",
		author: "JOHN C. MAXWELL",
	},
	{
		line1: "True growth begins",
		line2: "at the end of your",
		line3: "comfort zone.",
		author: "ROY T. BENNETT",
	},
];

export function AuthQuoteCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFading, setIsFading] = useState(false);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIsFading(true);
			setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
				setIsFading(false);
			}, 500);
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	const currentQuote = QUOTES[currentIndex];

	return (
		<div className="hidden md:flex md:w-2/5 relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
			{/* Soft radial glow blobs */}
			<div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
			<div className="absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full bg-white/8 blur-2xl pointer-events-none" />

			{/* Fine dot grid texture */}
			<div
				className="absolute inset-0 opacity-[0.12] pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle, white 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
			/>

			{/* Logo */}
			<div className="relative flex items-center gap-2.5 z-10">
				<div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center ring-1 ring-white/30">
					<Zap className="h-4 w-4 text-white" />
				</div>
				<span className="text-xl font-bold tracking-tight text-white">
					UpStride
				</span>
			</div>

			{/* Quote Carousel block */}
			<div className="relative space-y-6 flex-1 flex flex-col justify-center my-8 z-10">
				<div
					className={`relative transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}
				>
					{/* Giant decorative opening quote mark */}
					<span
						className="absolute -top-12 left-0 leading-none font-serif select-none text-white/20 pointer-events-none z-0"
						style={{ fontSize: "9rem", lineHeight: 0.8, marginLeft: "-0.08em" }}
						aria-hidden
					>
						"
					</span>

					<blockquote className="relative z-10 text-3xl font-bold leading-snug tracking-tight text-white mb-6">
						{currentQuote.line1}
						<br />
						<span className="text-white/70">{currentQuote.line2}</span>
						<br />
						<span className="relative inline-block">
							{currentQuote.line3}
							{/* Underline accent */}
							<span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-white/40" />
						</span>
					</blockquote>

					<p className="text-white/60 text-sm font-medium tracking-wide uppercase">
						— {currentQuote.author}
					</p>
				</div>

				{/* Carousel Indicators */}
				<div className="flex items-center gap-2 mt-8">
					{QUOTES.map((_, idx) => (
						<div
							key={idx}
							className={`h-1.5 rounded-full transition-all duration-300 ${
								idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/30"
							}`}
						/>
					))}
				</div>
			</div>

			{/* Bottom tagline */}
			<div className="relative z-10">
				<p className="text-white/50 text-sm leading-relaxed">
					Connect with world-class mentors.
					<br />
					Accelerate your career, your way.
				</p>
			</div>
		</div>
	);
}
