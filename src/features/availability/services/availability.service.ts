import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	CheckAndCreateAvailabilityResponse,
	CheckAndReenableAvailabilityResponse,
	CreateAvailabilityInput,
	GetMentorAvailabilitiesInput,
	MentorAvailabilitiesResponse,
} from "../types";

export const availabilityManagementService = {
	createAvailability: async (data: CreateAvailabilityInput) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AVAILABILITY.BASE}${ROUTES.AVAILABILITY.ROOT}`,
			data,
		);
		return response.data;
	},

	checkAndCreateAvailability: async (data: CreateAvailabilityInput) => {
		const response = await api.post<
			ApiSuccess<CheckAndReenableAvailabilityResponse>
		>(`${ROUTES.AVAILABILITY.BASE}${ROUTES.AVAILABILITY.CHECK_CREATE}`, data);
		return response.data;
	},
	checkAndReenableAvailability: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CheckAndReenableAvailabilityResponse>
		>(`${ROUTES.AVAILABILITY.BASE}${ROUTES.AVAILABILITY.CHECK_REENABLE(id)}`);
		return response.data;
	},

	getMentorAvailabilities: async (params: GetMentorAvailabilitiesInput) => {
		const query: Record<string, boolean> = {};
		const paginationQuery: Record<string, number> = {};
		if (params.expiredOnly === true) {
			query.expired = true;
		} else if (params.includeExpired === false) {
			query.expired = false;
		}
		if (params.status) {
			query.status = params.status;
		}
		if (params.page) {
			paginationQuery.page = params.page;
		}
		if (params.limit) {
			paginationQuery.limit = params.limit;
		}
		const response = await api.get<ApiSuccess<MentorAvailabilitiesResponse>>(
			`${ROUTES.AVAILABILITY.BASE}${ROUTES.AVAILABILITY.MENTOR}`,
			{ params: { ...query, ...paginationQuery } },
		);
		return response.data;
	},

	deleteAvailability: async (id: string) => {
		const response = await api.delete<ApiSuccess>(
			`${ROUTES.AVAILABILITY.BASE}${ROUTES.AVAILABILITY.DELETE(id)}`,
		);
		return response.data;
	},

	reenableAvailability: async (id: string) => {
		const response = await api.patch<ApiSuccess>(
			`${ROUTES.AVAILABILITY.BASE}${ROUTES.AVAILABILITY.REENABLE(id)}`,
		);
		return response.data;
	},
};
