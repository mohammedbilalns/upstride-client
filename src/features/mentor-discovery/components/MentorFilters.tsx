import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Search, X } from "lucide-react";
import type { MentorDiscoverySearch } from "../validators/mentor-discovery-params";

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
	searchInput: string;
	onSearchInputChange: (value: string) => void;
	onUpdate: (updates: Partial<MentorDiscoverySearch>) => void;
	onClear: () => void;
}

export function MentorFilters({
	search,
	searchInput,
	onSearchInputChange,
	onUpdate,
	onClear,
}: MentorFiltersProps) {
	const handleSearchSubmit = () => {
		onUpdate({ search: searchInput || undefined });
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSearchSubmit();
	};

	const hasFilters =
		search.search ||
		search.categoryId ||
		search.minExperience !== undefined ||
		search.maxExperience !== undefined;

	return (
		<div className="flex flex-col gap-3">
			{/* Search + Sort row */}
			<div className="flex gap-2 flex-wrap">
				<div className="relative flex-1 min-w-52">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
					<Input
						id="mentor-search"
						placeholder="Search mentors by name..."
						className="pl-9 h-9"
						value={searchInput}
						onChange={(e) => onSearchInputChange(e.target.value)}
						onKeyDown={handleSearchKeyDown}
					/>
				</div>
				<Select
					value={search.sort}
					onValueChange={(val) =>
						onUpdate({ sort: val as "rating" | "recent" })
					}
				>
					<SelectTrigger className="h-9 w-36">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="rating">Top Rated</SelectItem>
						<SelectItem value="recent">Recently Joined</SelectItem>
					</SelectContent>
				</Select>

				{/* Experience range */}
				<Select
					value={expRangeValue(search.minExperience, search.maxExperience)}
					onValueChange={(val) => {
						const { min, max } = parseExpRange(val);
						onUpdate({ minExperience: min, maxExperience: max });
					}}
				>
					<SelectTrigger className="h-9 w-44">
						<SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
						<SelectValue placeholder="Experience" />
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

				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClear}
						className="h-9 text-zinc-500 hover:text-zinc-700 gap-1"
					>
						<X className="h-3.5 w-3.5" />
						Clear
					</Button>
				)}
			</div>
		</div>
	);
}
