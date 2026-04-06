import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { cn } from "@/shared/utils/cn";

export default function DesktopNotifications({
	isOpen,
	onOpenChange,
	unreadCount,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	unreadCount: number;
}) {
	return (
		<div className="hidden sm:block">
			<DropdownMenu open={isOpen} onOpenChange={onOpenChange} modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"rounded-full relative h-8 w-8 md:h-9 md:w-9 transition-colors",
							isOpen && "bg-accent text-accent-foreground",
						)}
					>
						<Bell className="h-4.5 w-4.5 md:h-5 md:w-5 text-muted-foreground" />
						{unreadCount > 0 && (
							<Badge
								className="absolute -top-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center p-0 text-[9px] md:text-[10px] bg-primary"
								variant="default"
							>
								{unreadCount > 99 ? "99+" : unreadCount}
							</Badge>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-80 md:w-[22rem] p-0 border-border/80 shadow-2xl rounded-xl"
					align="end"
					sideOffset={8}
				>
					<NotificationDropdown onClose={() => onOpenChange(false)} />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
