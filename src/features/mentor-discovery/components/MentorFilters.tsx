import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import {
	MentorLanguageCodes,
	MentorLanguageMap,
} from "@/shared/constants/language.constants";
import type { CatalogInterest } from "@/features/onboarding/types";
import type { MentorDiscoverySearch } from "../validators/mentor-discovery-params.schema";

const EXPERIENCE_RANGES = [
	{ label: "Any experience", min: undefined, max: undefined },
	{ label: "0–2 years", min: 0, max: 2 },
	{ label: "3–5 years", min: 3, max: 5 },
	{ label: "6–10 years", min: 6, max: 10 },
	{ label: "10+ years", min: 10, max: undefined },
];

function expRangeValue(min?: number, max?: number): string {
	if (min === undefined && max === undefined) return "any";
	return `${min ?? ""},${max ?? ""}`;
}

function parseExpRange(val: string): { min?: number; max?: number } {
	if (val === "any") return { min: undefined, max: undefined };
	const [minStr, maxStr] = val.split(",");
	return {
		min: minStr !== "" ? Number(minStr) : undefined,
		max: maxStr !== "" ? Number(maxStr) : undefined,
	};
}

interface MentorFiltersProps {
	search: MentorDiscoverySearch;
	categories: CatalogInterest[];
	isLoadingCategories: boolean;
	onUpdate: (updates: Partial<MentorDiscoverySearch>) => void;
	onClear: () => void;
}

export function MentorFilters({
	search,
	categories,
	isLoadingCategories,
	onUpdate,
	onClear,
}: MentorFiltersProps) {
	const hasFilters =
		search.search ||
		search.category ||
		(search.languages && search.languages.length > 0) ||
		search.sort !== undefined ||
		search.minExperience !== undefined ||
		search.maxExperience !== undefined;

	return (
		<aside className="rounded-2xl border border-zinc-200/70 bg-white/60 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
			<div className="p-4">
				<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
					FILTERS
				</p>
			</div>

			<div className="px-4 pb-4 space-y-6">
				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
						SORT BY
					</p>
					<Select
						value={search.sort ?? "feed"}
						onValueChange={(value) =>
							onUpdate({
								sort:
									value === "feed"
										? undefined
										: (value as MentorDiscoverySearch["sort"]),
							})
						}
					>
						<SelectTrigger className="h-10 w-full justify-between bg-white/60 dark:bg-zinc-950/40">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="feed">For You</SelectItem>
							<SelectItem value="rating">Top Rated</SelectItem>
							<SelectItem value="recent">Recently Joined</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
						CATEGORY
					</p>
					<Select
						value={search.category ?? "all"}
						onValueChange={(val) =>
							onUpdate({ category: val === "all" ? undefined : val })
						}
						disabled={isLoadingCategories}
					>
						<SelectTrigger className="h-10 w-full justify-between bg-white/60 dark:bg-zinc-950/40">
							<SelectValue
								placeholder={
									isLoadingCategories ? "Loading categories..." : "All Skills"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Skills</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.name}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
						LANGUAGES
					</p>
					<div className="flex flex-wrap gap-2">
						{MentorLanguageCodes.map((languageCode) => {
							const selected =
								search.languages?.includes(languageCode) ?? false;
							return (
								<button
									key={languageCode}
									type="button"
									className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
										selected
											? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
											: "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300"
									}`}
									onClick={() => {
										const current = search.languages ?? [];
										onUpdate({
											languages: selected
												? current.filter((value) => value !== languageCode)
												: [...current, languageCode],
										});
									}}
								>
									{MentorLanguageMap[languageCode]}
								</button>
							);
						})}
					</div>
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
						EXPERIENCE
					</p>
					<Select
						value={expRangeValue(search.minExperience, search.maxExperience)}
						onValueChange={(val) => {
							const { min, max } = parseExpRange(val);
							onUpdate({ minExperience: min, maxExperience: max });
						}}
					>
						<SelectTrigger className="h-10 w-full justify-between bg-white/60 dark:bg-zinc-950/40">
							<span className="flex items-center gap-2">
								<SlidersHorizontal className="h-4 w-4 text-zinc-500" />
								<SelectValue placeholder="Any experience" />
							</span>
						</SelectTrigger>
						<SelectContent>
							{EXPERIENCE_RANGES.map((r) => (
								<SelectItem
									key={expRangeValue(r.min, r.max)}
									value={expRangeValue(r.min, r.max)}
								>
									{r.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClear}
						className="h-9 w-full justify-start text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 gap-2"
					>
						<X className="h-4 w-4" />
						Clear filters
					</Button>
				)}
			</div>
		</aside>
	);
}
