import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Button } from "../ui/Button";

export default function ThemeToggle() {
	const { isDarkMode, toggleTheme } = useTheme();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						aria-label="Toggle theme"
						className="
              relative h-10 w-10 rounded-full border
              bg-background/70 shadow-sm backdrop-blur-sm
              transition-all hover:scale-105 hover:shadow-md
            "
					>
						<motion.div
							key={isDarkMode ? "moon" : "sun"}
							initial={{
								rotate: isDarkMode ? -90 : 90,
								opacity: 0,
								scale: 0.8,
							}}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
						>
							{isDarkMode ? (
								<Moon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
							) : (
								<Sun className="h-5 w-5 text-amber-500" />
							)}
						</motion.div>
					</Button>
				</TooltipTrigger>

				<TooltipContent side="bottom">
					<p>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
