import { createFileRoute } from "@tanstack/react-router";
import { reportManagementQueryOptions } from "@/features/report-management/hooks/use-reports";
import { ReportManagementPage } from "@/features/report-management/pages/ReportManagementPage";
import { ReportManagementSearchSchema } from "@/features/report-management/validators/report-management-params";

export const Route = createFileRoute("/_admin-layout/report-management")({
	validateSearch: (search) => ReportManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(reportManagementQueryOptions(search)),
	component: ReportManagementPage,
});
