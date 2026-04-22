import { createFileRoute } from "@tanstack/react-router";
import { reportManagementQueryOptions } from "@/features/report/hooks/queries/useReports";
import { ReportManagementPage } from "@/features/report/pages/ReportManagementPage";
import { ReportManagementSearchSchema } from "@/features/report/validators/report-management-params.schema";

export const Route = createFileRoute("/_admin-layout/report-management")({
	validateSearch: (search) => ReportManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(reportManagementQueryOptions(search)),
	component: ReportManagementPage,
});
