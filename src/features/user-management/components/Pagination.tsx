import {
	ChevronLeft,
	ChevronRight,
	LayoutList,
	MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/shared/utils/cn";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
	onLimitChange,
}: PaginationProps) {
	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, totalItems);

	const getPageNumbers = () => {
		const pages = [];
		const showMax = 5;

		if (totalPages <= showMax) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis-1");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				if (!pages.includes(i)) pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("ellipsis-2");
			}

			if (!pages.includes(totalPages)) pages.push(totalPages);
		}
		return pages;
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 mt-4">
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
						Rows per page
					</span>
					<Select
						value={limit.toString()}
						onValueChange={(v) => onLimitChange(Number(v))}
					>
						<SelectTrigger className="w-18.75 h-9 border-muted-foreground/20">
							<SelectValue placeholder={limit} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="hidden sm:flex items-center text-sm font-medium text-muted-foreground">
					<LayoutList className="w-3.5 h-3.5 mr-2 opacity-50" />
					Showing {totalItems === 0 ? 0 : startItem}-{endItem} of {totalItems}
				</div>
			</div>

			<div className="flex items-center gap-1.5">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<div className="flex items-center gap-1">
					{getPageNumbers().map((page) => {
						if (typeof page === "string") {
							return (
								<div
									key={page}
									className="flex h-8 w-8 items-center justify-center text-muted-foreground"
								>
									<MoreHorizontal className="h-4 w-4" />
								</div>
							);
						}

						const isActive = currentPage === page;

						return (
							<Button
								key={page}
								variant={isActive ? "default" : "ghost"}
								size="icon"
								className={cn(
									"h-8 w-8 text-xs font-semibold rounded-md transition-all duration-200",
									isActive
										? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
										: "hover:bg-muted text-muted-foreground hover:text-foreground",
								)}
								onClick={() => onPageChange(page)}
							>
								{page}
							</Button>
						);
					})}
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages || totalPages === 0}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
