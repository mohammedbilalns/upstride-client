import { useNavigate } from "@tanstack/react-router";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Pagination } from "@/features/users/components/Pagination";
import { Route } from "@/routes/_admin-layout/report-management";
import { ReportTable } from "../components/ReportTable";
import { useReports } from "../hooks/queries/useReports";
import type { ReportManagementSearch } from "../validators/report-management-params.schema";

export function ReportManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const { data: reportsData } = useReports(searchParams);

	const handleFilterChange = <K extends keyof ReportManagementSearch>(
		key: K,
		value: ReportManagementSearch[K] | "all",
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
					<p className="text-muted-foreground mt-1 text-sm">
						{reportsData.pendingReports} pending reports ·{" "}
						{reportsData.appealedReports} appealed
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
								value === "PENDING" ||
								value === "RESOLVED" ||
								value === "CLOSED"
									? value
									: "all";
							handleFilterChange("status", status);
						}}
					>
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="All status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All status</SelectItem>
							<SelectItem value="PENDING">Pending</SelectItem>
							<SelectItem value="RESOLVED">Resolved</SelectItem>
							<SelectItem value="CLOSED">Closed</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-medium text-muted-foreground">
						Target
					</span>
					<Select
						value={searchParams.targetType || "all"}
						onValueChange={(value) => {
							const targetType =
								value === "all" || value === "USER" || value === "ARTICLE"
									? value
									: "all";
							handleFilterChange("targetType", targetType);
						}}
					>
						<SelectTrigger className="w-[160px] h-10">
							<SelectValue placeholder="All targets" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All targets</SelectItem>
							<SelectItem value="USER">User</SelectItem>
							<SelectItem value="ARTICLE">Article</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs font-medium text-muted-foreground">
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
							<SelectValue placeholder="All reports" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All reports</SelectItem>
							<SelectItem value="true">Appealed only</SelectItem>
							<SelectItem value="false">Non-appealed</SelectItem>
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
					navigate({ search: (prev) => ({ ...prev, page }) })
				}
				onLimitChange={(limit: number) =>
					navigate({ search: (prev) => ({ ...prev, limit, page: 1 }) })
				}
			/>
		</div>
	);
}
