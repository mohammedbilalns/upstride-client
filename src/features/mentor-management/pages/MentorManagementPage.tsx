import { useNavigate } from "@tanstack/react-router";
import { SortAsc, SortDesc } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Route } from "@/routes/_admin-layout/mentor-management";
import { useMentors } from "../hooks/use-mentors";
import { Pagination } from "../../user-management/components/Pagination";
import { MentorTable } from "../components/MentorTable";

export function MentorManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const { data: mentorsData } = useMentors(searchParams);

	const handleFilterChange = <K extends keyof typeof searchParams>(
		key: K,
		value: (typeof searchParams)[K] | "all",
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
					<p className="text-muted-foreground mt-1">
						Review and manage mentor applications and approvals.
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Status
					</span>
					<Select
						value={searchParams.status || "all"}
						onValueChange={(v) => handleFilterChange("status", v as any)}
					>
						<SelectTrigger className="w-[150px] h-10">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Sort
					</span>
					<Select
						value={searchParams.sort || "recent"}
						onValueChange={(v) => handleFilterChange("sort", v as any)}
					>
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="Sort By" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">
								<div className="flex items-center gap-2">
									<SortDesc className="w-3.5 h-3.5" />
									<span>Recent First</span>
								</div>
							</SelectItem>
							<SelectItem value="old">
								<div className="flex items-center gap-2">
									<SortAsc className="w-3.5 h-3.5" />
									<span>Oldest First</span>
								</div>
							</SelectItem>
							<SelectItem value="status">
								<div className="flex items-center gap-2">
									<SortDesc className="w-3.5 h-3.5" />
									<span>By Status</span>
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
					navigate({ search: (prev: any) => ({ ...prev, page }) })
				}
				onLimitChange={(limit: number) =>
					navigate({ search: (prev: any) => ({ ...prev, limit, page: 1 }) })
				}
			/>
		</div>
	);
}
