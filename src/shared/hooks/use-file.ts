import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fileService } from "../services/file.service";

export const useDeleteFile = () => {
	return useMutation({
		mutationFn: (key: string) => fileService.deleteFile(key),
		onSuccess: () => {
			toast.success("File removed successfully");
		},
		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Failed to remove file.");
		},
	});
};
