import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Send, X, MessageSquareOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { ChatMessage } from "../hooks/useChat";
import { format } from "date-fns";

interface ChatPanelProps {
	messages: ChatMessage[];
	onSendMessage: (message: string) => void;
	onClose: () => void;
	remoteParticipantName: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
	messages,
	onSendMessage,
	onClose,
	remoteParticipantName,
}) => {
	const [inputValue, setInputValue] = useState("");
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const lastMessageRef = useRef<HTMLDivElement>(null);

	const handleSend = () => {
		if (inputValue.trim()) {
			onSendMessage(inputValue);
			setInputValue("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	useEffect(() => {
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div className="flex flex-col h-full w-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-slate-800">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
						CH
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-100">
							In-Call Chat
						</h3>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800"
				>
					<X className="h-4 w-4" />
				</Button>
			</div>

			{/* Message List */}
			<ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full opacity-30 mt-20 text-center px-6">
						<MessageSquareOff className="h-12 w-12 mb-4" />
						<p className="text-sm">
							No messages yet. Send a message to start chatting with{" "}
							{remoteParticipantName}.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{messages.map((msg, index) => (
							<div
								key={`${msg.timestamp}-${index}`}
								ref={index === messages.length - 1 ? lastMessageRef : null}
								className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
										msg.isSelf
											? "bg-primary text-primary-foreground rounded-tr-none"
											: "bg-slate-800 text-slate-100 rounded-tl-none"
									}`}
								>
									<p className="whitespace-pre-wrap break-words">
										{msg.message}
									</p>
								</div>
								<span className="text-[10px] text-slate-500 mt-1 px-1">
									{msg.isSelf ? "You" : remoteParticipantName} •{" "}
									{format(new Date(msg.timestamp), "HH:mm")}
								</span>
							</div>
						))}
					</div>
				)}
			</ScrollArea>

			{/* Input Area */}
			<div className="p-4 bg-slate-900 border-t border-slate-800">
				<div className="flex items-end gap-2 bg-slate-950/50 border border-slate-700/50 rounded-2xl p-2 focus-within:border-primary/50 transition-colors">
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder="Type a message..."
						className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] text-sm"
					/>
					<Button
						size="icon"
						onClick={handleSend}
						disabled={!inputValue.trim()}
						className={`h-9 w-9 rounded-xl transition-all ${
							inputValue.trim()
								? "bg-primary text-primary-foreground scale-100"
								: "bg-slate-800 text-slate-500 scale-90"
						}`}
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
