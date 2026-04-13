import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function MobileControls({
	isMenuOpen,
	onToggleMenu,
	children,
}: {
	isMenuOpen: boolean;
	onToggleMenu: () => void;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center gap-1 md:hidden">
			{children}
			<Button
				variant="ghost"
				size="icon"
				onClick={onToggleMenu}
				className="h-8 w-8 rounded-lg"
			>
				{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</Button>
		</div>
	);
}
