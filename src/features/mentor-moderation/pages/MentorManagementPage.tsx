import { useNavigate } from "@tanstack/react-router";
import { SortAsc, SortDesc } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Route } from "@/routes/_admin-layout/mentor-management";
import { Pagination } from "../../users/components/Pagination";
import { MentorTable } from "../components/MentorTable";
import { useMentors } from "../hooks/queries/useMentors";
import type { MentorManagementSearch } from "../validators/mentor-management-params.schema";

export function MentorManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const { data: mentorsData } = useMentors(searchParams);

	const handleFilterChange = <K extends keyof MentorManagementSearch>(
		key: K,
		value: MentorManagementSearch[K] | "all",
	) => {
		navigate({
			search: (prev) => ({
				...prev,
				[key]: value === "all" ? undefined : value,
				page: 1,
			}),
		});
	};

	if (!mentorsData) return null;

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Mentor Management
					</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						{mentorsData.newMentorRequests} new requests ·{" "}
						{mentorsData.approvedMentors} approved mentors
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
				<div className="flex items-center gap-2">
					<span className="text-xs font-medium text-muted-foreground">
						Status
					</span>
					<Select
						value={searchParams.status || "all"}
						onValueChange={(value) => {
							const status =
								value === "all" ||
								value === "pending" ||
								value === "approved" ||
								value === "rejected"
									? value
									: "all";
							handleFilterChange("status", status);
						}}
					>
						<SelectTrigger className="w-[150px] h-10">
							<SelectValue placeholder="All status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All status</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-medium text-muted-foreground">
						Sort
					</span>
					<Select
						value={searchParams.sort || "recent"}
						onValueChange={(value) => {
							const sort =
								value === "recent" || value === "old" || value === "status"
									? value
									: "recent";
							handleFilterChange("sort", sort);
						}}
					>
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">
								<div className="flex items-center gap-2">
									<SortDesc className="w-3.5 h-3.5" />
									<span>Recent first</span>
								</div>
							</SelectItem>
							<SelectItem value="old">
								<div className="flex items-center gap-2">
									<SortAsc className="w-3.5 h-3.5" />
									<span>Oldest first</span>
								</div>
							</SelectItem>
							<SelectItem value="status">
								<div className="flex items-center gap-2">
									<SortDesc className="w-3.5 h-3.5" />
									<span>By status</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<MentorTable mentors={mentorsData.items} />

			<Pagination
				currentPage={mentorsData.page}
				totalPages={mentorsData.totalPages}
				totalItems={mentorsData.total}
				limit={mentorsData.limit}
				onPageChange={(page: number) =>
					navigate({ search: (prev) => ({ ...prev, page }) })
				}
				onLimitChange={(limit: number) =>
					navigate({ search: (prev) => ({ ...prev, limit, page: 1 }) })
				}
			/>
		</div>
	);
}
