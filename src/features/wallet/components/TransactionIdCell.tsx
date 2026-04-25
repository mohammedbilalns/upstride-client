import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/shared/utils/cn";

interface TransactionIdCellProps {
	value: string;
	label?: string;
	className?: string;
}

export function TransactionIdCell({
	value,
	label = "Copy transaction ID",
	className,
}: TransactionIdCellProps) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timeoutId = window.setTimeout(() => setCopied(false), 1500);
		return () => window.clearTimeout(timeoutId);
	}, [copied]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			toast.success("Transaction ID copied.");
		} catch {
			toast.error("Failed to copy transaction ID.");
		}
	};

	return (
		<div className={cn("flex min-w-0 items-start gap-2", className)}>
			<span
				className="min-w-0 flex-1 font-mono text-xs leading-5 whitespace-normal break-all text-muted-foreground"
				title={value}
			>
				{value}
			</span>

			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							className="shrink-0 text-muted-foreground hover:text-foreground"
							onClick={handleCopy}
							aria-label={label}
						>
							{copied ? (
								<Check className="size-3.5" />
							) : (
								<Copy className="size-3.5" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{copied ? "Copied" : label}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
