import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { fileService } from "../services/file.service";

/**
 * Hook for deleting a file from storage.
 */
export const useDeleteFile = () => {
	return useMutation({
		mutationFn: (key: string) => fileService.deleteFile(key),
		onSuccess: () => {
			toast.success("File removed successfully");
		},
		onError: (err: ApiError) => {
			toast.error(err.response?.data?.message || "Failed to remove file.");
		},
	});
};
