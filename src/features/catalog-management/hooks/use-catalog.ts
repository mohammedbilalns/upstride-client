import {
	queryOptions,
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";
import type {
	AddInterestInput,
	AddProfessionInput,
	AddSkillInput,
} from "../types";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";

const getErrorMessage = (error: ApiError, defaultMessage: string) => {
	return error.response?.data?.message || defaultMessage;
};

export const catalogQueryOptions = queryOptions({
	queryKey: ["catalog"],
	queryFn: () => catalogService.fetchCatalog(),
});

export function useCatalog() {
	return useQuery(catalogQueryOptions);
}

export function useCatalogMutations() {
	const queryClient = useQueryClient();

	const addInterest = useMutation({
		mutationFn: (data: AddInterestInput) => catalogService.addInterest(data),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to add interest"));
		},
	});

	const disableInterest = useMutation({
		mutationFn: (id: string) => catalogService.disableInterest(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to disable interest"));
		},
	});

	const addProfession = useMutation({
		mutationFn: (data: AddProfessionInput) =>
			catalogService.addProfession(data),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to add profession"));
		},
	});

	const disableProfession = useMutation({
		mutationFn: (id: string) => catalogService.disableProfession(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to disable profession"));
		},
	});

	const addSkill = useMutation({
		mutationFn: (data: AddSkillInput) => catalogService.addSkill(data),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to add skill"));
		},
	});

	const disableSkill = useMutation({
		mutationFn: (id: string) => catalogService.disableSkill(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to disable skill"));
		},
	});

	return {
		addInterest,
		disableInterest,
		addProfession,
		disableProfession,
		addSkill,
		disableSkill,
	};
}
