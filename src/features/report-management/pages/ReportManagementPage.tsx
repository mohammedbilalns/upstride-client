import { useNavigate } from "@tanstack/react-router";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/features/user-management/components/Pagination";
import { Route } from "@/routes/_admin-layout/report-management";
import { ReportTable } from "../components/ReportTable";
import { useReports } from "../hooks/use-reports";

export function ReportManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const { data: reportsData } = useReports(searchParams);

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

	if (!reportsData) return null;

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Report Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Review and resolve user and article reports.
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
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="PENDING">Pending</SelectItem>
							<SelectItem value="RESOLVED">Resolved</SelectItem>
							<SelectItem value="REJECTED">Rejected</SelectItem>
							<SelectItem value="CLOSED">Closed</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Target
					</span>
					<Select
						value={searchParams.targetType || "all"}
						onValueChange={(v) => handleFilterChange("targetType", v as any)}
					>
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="All Targets" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Targets</SelectItem>
							<SelectItem value="USER">User</SelectItem>
							<SelectItem value="ARTICLE">Article</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Appealed
					</span>
					<Select
						value={
							searchParams.isAppealSubmitted === true
								? "true"
								: searchParams.isAppealSubmitted === false
									? "false"
									: "all"
						}
						onValueChange={(v) =>
							handleFilterChange(
								"isAppealSubmitted",
								v === "all" ? undefined : v === "true",
							)
						}
					>
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="All Reports" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Reports</SelectItem>
							<SelectItem value="true">Appealed Only</SelectItem>
							<SelectItem value="false">Non-Appealed</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<ReportTable reports={reportsData.reports} />

			<Pagination
				currentPage={reportsData.page}
				totalPages={reportsData.totalPages}
				totalItems={reportsData.total}
				limit={reportsData.limit}
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
