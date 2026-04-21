import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { catalogService } from "../../services/catalog.service";
import type {
	AddInterestInput,
	AddProfessionInput,
	AddSkillInput,
	CatalogIsActiveMutationResponse,
	FetchCatalogResponse,
} from "../../types";

const getErrorMessage = (error: ApiError, defaultMessage: string) =>
	error.response?.data?.message || defaultMessage;

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
			queryClient.setQueryData<FetchCatalogResponse>(["catalog"], (old) => {
				if (!old) return old;

				return {
					...old,
					data: {
						...old.data,
						interests: old.data.interests.map((interest) =>
							interest.id === res.data.resourceId
								? { ...interest, isActive: false }
								: interest,
						),
					},
				};
			});
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to disable interest"));
		},
	});

	const disableSkill = useMutation({
		mutationFn: (id: string) => catalogService.disableSkill(id),
		onSuccess: (res: CatalogIsActiveMutationResponse) => {
			toast.success(res.message);
			queryClient.setQueryData<FetchCatalogResponse>(["catalog"], (old) => {
				if (!old) return old;

				return {
					...old,
					data: {
						...old.data,
						interests: old.data.interests.map((interest) => ({
							...interest,
							skills: interest.skills.map((skill) =>
								skill.id === res.data.resourceId
									? { ...skill, isActive: false }
									: skill,
							),
						})),
					},
				};
			});
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to disable skill"));
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
		onSuccess: (res: CatalogIsActiveMutationResponse) => {
			toast.success(res.message);
			queryClient.setQueryData<FetchCatalogResponse>(["catalog"], (old) => {
				if (!old) return old;

				return {
					...old,
					data: {
						...old.data,
						professions: old.data.professions.map((profession) =>
							profession.id === res.data.resourceId
								? { ...profession, isActive: false }
								: profession,
						),
					},
				};
			});
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

	const enableInterest = useMutation({
		mutationFn: (id: string) => catalogService.enableInterest(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.setQueryData<FetchCatalogResponse>(["catalog"], (old) => {
				if (!old) return old;

				return {
					...old,
					data: {
						...old.data,
						interests: old.data.interests.map((interest) =>
							interest.id === res.data.resourceId
								? { ...interest, isActive: true }
								: interest,
						),
					},
				};
			});
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to enable interest"));
		},
	});

	const enableProfession = useMutation({
		mutationFn: (id: string) => catalogService.enableProfession(id),
		onSuccess: (res) => {
			toast.success(res.message);
			queryClient.setQueryData<FetchCatalogResponse>(["catalog"], (old) => {
				if (!old) return old;

				return {
					...old,
					data: {
						...old.data,
						professions: old.data.professions.map((profession) =>
							profession.id === res.data.resourceId
								? { ...profession, isActive: true }
								: profession,
						),
					},
				};
			});
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to enable profession"));
		},
	});

	const enableSkill = useMutation({
		mutationFn: (id: string) => catalogService.enableSkill(id),
		onSuccess: (res: CatalogIsActiveMutationResponse) => {
			toast.success(res.message);
			queryClient.setQueryData<FetchCatalogResponse>(["catalog"], (old) => {
				if (!old) return old;

				return {
					...old,
					data: {
						...old.data,
						interests: old.data.interests.map((interest) => ({
							...interest,
							skills: interest.skills.map((skill) =>
								skill.id === res.data.resourceId
									? { ...skill, isActive: true }
									: skill,
							),
						})),
					},
				};
			});
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
