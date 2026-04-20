import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { cn } from "@/shared/utils/cn";

export default function MobileNotifications({
	isOpen,
	onOpenChange,
	unreadCount,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	unreadCount: number;
}) {
	return (
		<div className="sm:hidden">
			<DropdownMenu open={isOpen} onOpenChange={onOpenChange} modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8 rounded-lg relative",
							isOpen && "bg-accent text-accent-foreground",
						)}
					>
						<Bell className="h-5 w-5 text-muted-foreground" />
						{unreadCount > 0 && (
							<Badge
								className="absolute -top-1 -right-1 h-3.5 w-3.5 flex items-center justify-center p-0 text-[8px] bg-primary"
								variant="default"
							>
								{unreadCount > 99 ? "99+" : unreadCount}
							</Badge>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-[calc(100vw-2.5rem)] max-w-sm p-0 border-border/80 shadow-2xl rounded-xl"
					align="end"
					sideOffset={12}
				>
					<NotificationDropdown onClose={() => onOpenChange(false)} />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
