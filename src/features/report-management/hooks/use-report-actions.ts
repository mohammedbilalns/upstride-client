import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReportManagementService } from "../services/report-management.service";
import type { UpdateReportStatusInput } from "../types";

export function useResolveReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateReportStatusInput) =>
			ReportManagementService.updateReportStatus(input),
		onSuccess: () => {
			toast.success("Report marked as resolved");
			queryClient.invalidateQueries({ queryKey: ["reports"] });
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to update report");
		},
	});
}

export function useBlockArticle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ReportManagementService.blockArticle,
		onSuccess: () => {
			toast.success("Article blocked successfully");
			queryClient.invalidateQueries({ queryKey: ["reports"] });
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to block article");
		},
	});
}
