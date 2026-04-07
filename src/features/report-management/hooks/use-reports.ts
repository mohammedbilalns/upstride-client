import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { ReportManagementService } from "../services/report-management.service";
import type { GetReportsInput } from "../types";

export const reportManagementQueryOptions = (params: GetReportsInput) =>
	queryOptions({
		queryKey: ["reports", params],
		queryFn: () => ReportManagementService.getReports(params),
		placeholderData: keepPreviousData,
	});

export function useReports(params: GetReportsInput) {
	return useQuery(reportManagementQueryOptions(params));
}
