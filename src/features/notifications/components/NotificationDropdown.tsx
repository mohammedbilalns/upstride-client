import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/shared/utils/cn";
import {
	useGetNotifications,
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
} from "../hooks";
import type { NotificationDto, NotificationReadFilter } from "../types";

export function NotificationDropdown({ onClose }: { onClose?: () => void }) {
	const [activeTab, setActiveTab] = useState<NotificationReadFilter>("all");

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useGetNotifications({ status: activeTab });
	const markReadMutation = useMarkNotificationRead();
	const markAllReadMutation = useMarkAllNotificationsRead();
	const navigate = useNavigate();

	const notifications = data?.pages.flatMap((page) => page.notifications) || [];

	const handleMarkRead = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		markReadMutation.mutate(id);
	};

	const handleNotificationClick = (notification: NotificationDto) => {
		if (!notification.isRead) {
			markReadMutation.mutate(notification.id);
		}

		// Close dropdown
		onClose?.();

		// Navigate if it's a chat message
		if (notification.type === "CHAT" && notification.metadata?.chatId) {
			navigate({
				to: "/chats/$chatId",
				params: { chatId: notification.relatedEntityId as string },
			});
		}
	};

	const handleMarkAllRead = () => {
		markAllReadMutation.mutate();
	};

	const getNotificationIcon = (_type: NotificationDto["type"]) => {
		return (
			<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
				<Bell className="h-4 w-4" />
			</div>
		);
	};

	return (
		<div className="w-full flex flex-col h-[60vh] md:h-[26rem] bg-background rounded-xl overflow-hidden">
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

				<TabsContent
					value="all"
					className="flex-1 min-h-0 m-0 border-none outline-none"
				>
					<ScrollArea className="h-full mt-2">
						<div className="pb-2">
							<NotificationList
								notifications={notifications}
								isLoading={isLoading}
								isFetchingNextPage={isFetchingNextPage}
								hasNextPage={hasNextPage}
								fetchNextPage={fetchNextPage}
								getNotificationIcon={getNotificationIcon}
								handleMarkRead={handleMarkRead}
								handleNotificationClick={handleNotificationClick}
								isMarkReadPending={markReadMutation.isPending}
							/>
						</div>
					</ScrollArea>
				</TabsContent>
				<TabsContent
					value="unread"
					className="flex-1 min-h-0 m-0 border-none outline-none"
				>
					<ScrollArea className="h-full mt-2">
						<div className="pb-2">
							<NotificationList
								notifications={notifications}
								isLoading={isLoading}
								isFetchingNextPage={isFetchingNextPage}
								hasNextPage={hasNextPage}
								fetchNextPage={fetchNextPage}
								getNotificationIcon={getNotificationIcon}
								handleMarkRead={handleMarkRead}
								handleNotificationClick={handleNotificationClick}
								isMarkReadPending={markReadMutation.isPending}
							/>
						</div>
					</ScrollArea>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function NotificationList({
	notifications,
	isLoading,
	isFetchingNextPage,
	hasNextPage,
	fetchNextPage,
	getNotificationIcon,
	handleMarkRead,
	handleNotificationClick,
	isMarkReadPending,
}: {
	notifications: NotificationDto[];
	isLoading: boolean;
	isFetchingNextPage: boolean;
	hasNextPage?: boolean;
	fetchNextPage: () => void;
	getNotificationIcon: (type: NotificationDto["type"]) => React.ReactNode;
	handleMarkRead: (id: string, e: React.MouseEvent) => void;
	handleNotificationClick: (notification: NotificationDto) => void;
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
					onClick={() => handleNotificationClick(notification)}
					className={cn(
						"flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 cursor-pointer relative group border-b border-border/20 last:border-0",
						!notification.isRead && "bg-primary/5",
					)}
				>
					<div className="flex items-start gap-3">
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
							<p className="text-xs text-muted-foreground line-clamp-2">
								{notification.description}
							</p>
						</div>
					</div>

					{!notification.isRead && (
						<div className="flex justify-end mt-1">
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 text-[11px] font-semibold text-primary hover:text-primary/80 hover:bg-transparent transition-opacity"
								onClick={(e) => handleMarkRead(notification.id, e)}
								disabled={isMarkReadPending}
							>
								Mark as read
							</Button>
						</div>
					)}
				</div>
			))}

			{hasNextPage && (
				<div className="p-3 pt-4 flex justify-center border-t border-border/10">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
						className="h-8 text-xs font-medium text-primary hover:text-primary/90 hover:bg-primary/10 transition-colors w-full gap-2"
					>
						{isFetchingNextPage ? (
							<>
								<Loader2 className="h-3 w-3 animate-spin" />
								Loading...
							</>
						) : (
							"View more notifications"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
