import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import type { ApiSuccess } from "@/api/apiSuccess";
import { catalogService } from "../../services/catalog.service";
import type { FetchCatalogResponse, UpdateCatalogInput } from "../../types";

type CatalogQueryData = ApiSuccess<FetchCatalogResponse>;

type UpdateCatalogMutationInput = {
	id: string;
	data: UpdateCatalogInput;
};

const getErrorMessage = (error: ApiError, defaultMessage: string) =>
	error.response?.data?.message || defaultMessage;

const updateCatalogCache = (
	queryClient: QueryClient,
	updater: (catalog: FetchCatalogResponse) => FetchCatalogResponse,
) => {
	queryClient.setQueryData<CatalogQueryData>(["catalog"], (old) => {
		if (!old) return old;

		return {
			...old,
			data: updater(old.data),
		};
	});
};

export function useUpdateCatalog() {
	const queryClient = useQueryClient();

	const updateInterest = useMutation({
		mutationFn: ({ id, data }: UpdateCatalogMutationInput) =>
			catalogService.updateInterest(id, data),
		onSuccess: (response, variables) => {
			toast.success(response.message || "Interest updated successfully");
			updateCatalogCache(queryClient, (catalog) => ({
				...catalog,
				interests: catalog.interests.map((interest) =>
					interest.id === variables.id
						? { ...interest, name: variables.data.name }
						: interest,
				),
			}));
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to update interest"));
		},
	});

	const updateSkill = useMutation({
		mutationFn: ({ id, data }: UpdateCatalogMutationInput) =>
			catalogService.updateSkill(id, data),
		onSuccess: (response, variables) => {
			toast.success(response.message || "Skill updated successfully");
			updateCatalogCache(queryClient, (catalog) => ({
				...catalog,
				interests: catalog.interests.map((interest) => ({
					...interest,
					skills: interest.skills.map((skill) =>
						skill.id === variables.id
							? { ...skill, name: variables.data.name }
							: skill,
					),
				})),
			}));
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to update skill"));
		},
	});

	const updateProfession = useMutation({
		mutationFn: ({ id, data }: UpdateCatalogMutationInput) =>
			catalogService.updateProfession(id, data),
		onSuccess: (response, variables) => {
			toast.success(response.message || "Profession updated successfully");
			updateCatalogCache(queryClient, (catalog) => ({
				...catalog,
				professions: catalog.professions.map((profession) =>
					profession.id === variables.id
						? { ...profession, name: variables.data.name }
						: profession,
				),
			}));
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error: ApiError) => {
			toast.error(getErrorMessage(error, "Failed to update profession"));
		},
	});

	return {
		updateInterest,
		updateSkill,
		updateProfession,
	};
}
