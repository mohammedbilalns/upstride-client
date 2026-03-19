import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { catalogService } from "../services/catalog.service";
import type {
	AddInterestInput,
	AddProfessionInput,
	AddSkillInput,
} from "../types";

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

	const enableInterest = useMutation({
		mutationFn: (id: string) => catalogService.enableInterest(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to enable interest"));
		},
	});

	const enableProfession = useMutation({
		mutationFn: (id: string) => catalogService.enableProfession(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to enable profession"));
		},
	});

	const enableSkill = useMutation({
		mutationFn: (id: string) => catalogService.enableSkill(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to enable skill"));
		},
	});

	return {
		addInterest,
		disableInterest,
		enableInterest,
		addProfession,
		disableProfession,
		enableProfession,
		addSkill,
		disableSkill,
		enableSkill,
	};
}
