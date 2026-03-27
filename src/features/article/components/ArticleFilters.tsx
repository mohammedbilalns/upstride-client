import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ArticleSearch } from "../validators/article-search-params";

interface ArticleFiltersProps {
	search: ArticleSearch;
	categories: { id: string; name: string }[];
	isLoadingCategories: boolean;
	topTags?: { tag: string; count: number }[];
	isLoadingTags?: boolean;
	onUpdate: (updates: Partial<ArticleSearch>) => void;
	onClear: () => void;
}

export function ArticleFilters({
	search,
	categories,
	topTags = [],
	isLoadingTags,
	onUpdate,
	onClear,
}: ArticleFiltersProps) {
	return (
		<div className="space-y-6">
			<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-3">
				<div className="flex items-center justify-between">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
						Filters
					</p>
					{(search.category || search.search) && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClear}
							className="h-7 px-2 text-xs text-primary hover:text-primary/90 hover:bg-primary/10"
						>
							Clear all
						</Button>
					)}
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
							Category
						</label>
						<Select
							value={search.category || "all"}
							onValueChange={(value) =>
								onUpdate({ category: value === "all" ? undefined : value })
							}
						>
							<SelectTrigger className="h-10 rounded-xl bg-white/60 dark:bg-zinc-950/40">
								<SelectValue placeholder="Select Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.name}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="rounded-2xl border border-zinc-200/70 bg-primary/10 dark:bg-primary/15 p-5">
				<h4 className="text-sm font-bold text-primary mb-2">Trending Tags</h4>
				{isLoadingTags ? (
					<div className="flex flex-wrap gap-2 animate-pulse">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-6 w-16 bg-white/60 dark:bg-zinc-900/40 rounded-full"
							/>
						))}
					</div>
				) : topTags.length === 0 ? (
					<p className="text-xs text-zinc-500 italic">No tags yet</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{topTags.map((t) => (
							<Badge
								key={t.tag}
								variant="secondary"
								onClick={() => onUpdate({ search: t.tag })}
								className="bg-white/80 dark:bg-zinc-900/50 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer border-transparent"
							>
								#{t.tag}
							</Badge>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
