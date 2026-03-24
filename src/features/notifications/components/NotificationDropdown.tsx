import { useState } from "react";
import { Bell, Check, CheckCircle2, CircleDashed } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGetNotifications,
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
} from "../hooks";
import type { NotificationDto, NotificationReadFilter } from "../types";
export function NotificationDropdown() {
	const [activeTab, setActiveTab] = useState<NotificationReadFilter>("all");

	const { data, isLoading } = useGetNotifications({ status: activeTab });
	const markReadMutation = useMarkNotificationRead();
	const markAllReadMutation = useMarkAllNotificationsRead();

	const notifications = data?.notifications || [];

	const handleMarkRead = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		markReadMutation.mutate(id);
	};

	const handleMarkAllRead = () => {
		markAllReadMutation.mutate();
	};

	const getNotificationIcon = (_type: NotificationDto["type"]) => {
		// Can expand this based on type (CHAT, ARTICLE, SESSION, etc)
		return (
			<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
				<Bell className="h-4 w-4" />
			</div>
		);
	};

	return (
		<div className="w-full flex flex-col max-h-[85vh] md:max-h-[32rem] bg-background rounded-xl overflow-hidden">
			<div className="flex items-center justify-between p-4 border-b border-border/40 pb-3">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-foreground tracking-tight">
						Notifications
					</h3>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
					onClick={handleMarkAllRead}
					disabled={markAllReadMutation.isPending || notifications.length === 0}
				>
					<CheckCircle2 className="mr-1 h-3.5 w-3.5" />
					Mark all read
				</Button>
			</div>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={(val) => setActiveTab(val as NotificationReadFilter)}
				className="flex-1 flex flex-col overflow-hidden"
			>
				<div className="px-4 pt-2">
					<TabsList className="w-full grid grid-cols-2">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="unread">Unread</TabsTrigger>
					</TabsList>
				</div>

				<div className="flex-1 overflow-y-auto mt-2 pb-2">
					<TabsContent value="all" className="m-0 border-none outline-none">
						<NotificationList
							notifications={notifications}
							isLoading={isLoading}
							getNotificationIcon={getNotificationIcon}
							handleMarkRead={handleMarkRead}
							isMarkReadPending={markReadMutation.isPending}
						/>
					</TabsContent>
					<TabsContent value="unread" className="m-0 border-none outline-none">
						<NotificationList
							notifications={notifications}
							isLoading={isLoading}
							getNotificationIcon={getNotificationIcon}
							handleMarkRead={handleMarkRead}
							isMarkReadPending={markReadMutation.isPending}
						/>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}

function NotificationList({
	notifications,
	isLoading,
	getNotificationIcon,
	handleMarkRead,
	isMarkReadPending,
}: {
	notifications: NotificationDto[];
	isLoading: boolean;
	getNotificationIcon: (type: NotificationDto["type"]) => React.ReactNode;
	handleMarkRead: (id: string, e: React.MouseEvent) => void;
	isMarkReadPending: boolean;
}) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-10 px-4 text-center">
				<CircleDashed className="h-6 w-6 animate-spin text-muted-foreground mb-3" />
				<p className="text-sm text-muted-foreground">
					Loading notifications...
				</p>
			</div>
		);
	}

	if (notifications.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-10 px-4 text-center">
				<div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
					<Bell className="h-5 w-5 text-muted-foreground" />
				</div>
				<p className="text-sm font-medium">No notifications yet</p>
				<p className="text-xs text-muted-foreground mt-1">
					We'll notify you when something happens.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={cn(
						"flex items-start gap-3 p-4 transition-colors hover:bg-muted/50 relative group",
						!notification.isRead && "bg-primary/5",
					)}
				>
					{getNotificationIcon(notification.type)}

					<div className="flex-1 flex flex-col gap-1 min-w-0">
						<div className="flex items-start justify-between gap-2">
							<p className="text-sm font-medium leading-tight text-foreground line-clamp-2">
								{notification.title}
							</p>
							<span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap pt-0.5">
								{formatDistanceToNow(new Date(notification.createdAt), {
									addSuffix: true,
								})}
							</span>
						</div>
						<p className="text-xs text-muted-foreground line-clamp-2 pr-6">
							{notification.description}
						</p>
					</div>

					{!notification.isRead && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-1/2 -translate-y-1/2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-sm border border-border/50 hover:bg-primary/10 hover:text-primary"
							onClick={(e) => handleMarkRead(notification.id, e)}
							disabled={isMarkReadPending}
							title="Mark as read"
						>
							<Check className="h-3.5 w-3.5" />
						</Button>
					)}

					{!notification.isRead && (
						<div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary group-hover:opacity-0 transition-opacity" />
					)}
				</div>
			))}
		</div>
	);
}
