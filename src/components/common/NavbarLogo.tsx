import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export default function NavbarLogo({ onNavigate }: { onNavigate: () => void }) {
	return (
		<Link
			to="/home"
			className="flex items-center gap-2 group"
			onClick={onNavigate}
		>
			<div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/30 group-hover:shadow-primary/50 transition-all">
				<Zap className="h-3.5 w-3.5 text-primary-foreground" />
			</div>
			<span className="text-lg font-bold tracking-tight">UpStride</span>
		</Link>
	);
}
