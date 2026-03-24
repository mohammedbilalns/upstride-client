import { FileIcon, FileText } from "lucide-react";
import type { ChatMessageDto } from "@/features/chat/types";

interface ChatMessageProps {
	message: ChatMessageDto;
	isMe: boolean;
	localMediaPreviews?: Record<string, string>;
}

function formatTime(dateStr: string): string {
	return new Date(dateStr).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function ChatMessage({
	message,
	isMe,
	localMediaPreviews,
}: ChatMessageProps) {
	const bubbleClass = isMe
		? "bg-primary text-primary-foreground rounded-br-sm"
		: "bg-muted text-foreground rounded-bl-sm";

	const previewUrl =
		message.mediaUrl ||
		(message.content ? localMediaPreviews?.[message.content] : null);

	return (
		<div
			className={`flex w-full mb-1 ${isMe ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
			>
				<div className={`px-4 py-2 rounded-2xl ${bubbleClass}`}>
					{message.messageType === "TEXT" && (
						<p className="text-sm whitespace-pre-wrap">{message.content}</p>
					)}

					{message.messageType === "IMAGE" && (
						<div className="flex flex-col gap-1">
							{previewUrl ? (
								<a
									href={previewUrl}
									target="_blank"
									rel="noreferrer"
									className="block overflow-hidden rounded-lg group mt-1"
								>
									<img
										src={previewUrl}
										alt={message.content ?? "Image"}
										className="max-w-full sm:max-w-[300px] rounded-lg border border-white/10 hover:scale-105 transition-transform duration-200"
									/>
								</a>
							) : (
								<div className="flex items-center gap-2 px-1 py-1 rounded-md bg-white/10">
									<FileIcon className="w-5 h-5 opacity-70" />
									<span className="text-sm">{message.content ?? "Image"}</span>
								</div>
							)}
						</div>
					)}

					{message.messageType === "FILE" && (
						<div
							className={`flex items-center gap-2 p-2 rounded-md mt-1 ${isMe ? "bg-primary-foreground/10" : "bg-background"}`}
						>
							<FileText className="w-8 h-8 opacity-80 shrink-0" />
							{previewUrl ? (
								<a
									href={previewUrl}
									target="_blank"
									rel="noreferrer"
									className="text-sm truncate underline underline-offset-2 hover:opacity-80 transition-opacity"
								>
									{message.content ?? "Document"}
								</a>
							) : (
								<span className="text-sm truncate">
									{message.content ?? "Document"}
								</span>
							)}
						</div>
					)}
				</div>

				<span className="text-[10px] text-muted-foreground mt-0.5 mx-1">
					{formatTime(message.createdAt)}
				</span>
			</div>
		</div>
	);
}
