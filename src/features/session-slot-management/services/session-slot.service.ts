import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	CancelSlotInput,
	CancelSlotResponse,
	CreateCustomSlotInput,
	CreateCustomSlotResponse,
	DeleteSlotInput,
	DeleteSlotResponse,
	EnableSlotInput,
	EnableSlotResponse,
	GenerateSlotsInput,
	GenerateSlotsResponse,
	GetMentorSlotsInput,
	GetMentorSlotsResponse,
} from "../types";

export const sessionSlotService = {
	getMentorSlots: async (
		params: GetMentorSlotsInput = {},
	): Promise<GetMentorSlotsResponse> => {
		const response = await api.get<GetMentorSlotsResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.ROOT}`,
			{ params },
		);
		return response.data;
	},

	createCustomSlot: async (
		data: CreateCustomSlotInput,
	): Promise<CreateCustomSlotResponse> => {
		const response = await api.post<CreateCustomSlotResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.CUSTOM}`,
			data,
		);
		return response.data;
	},

	cancelSlot: async (data: CancelSlotInput): Promise<CancelSlotResponse> => {
		const response = await api.patch<CancelSlotResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.CANCEL(data.slotId)}`,
		);
		return response.data;
	},

	enableSlot: async (data: EnableSlotInput): Promise<EnableSlotResponse> => {
		const response = await api.patch<EnableSlotResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.ENABLE(data.slotId)}`,
		);
		return response.data;
	},

	deleteSlot: async (data: DeleteSlotInput): Promise<DeleteSlotResponse> => {
		const response = await api.delete<DeleteSlotResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.BY_ID(data.slotId)}`,
		);
		return response.data;
	},

	generateSlots: async (
		data: GenerateSlotsInput,
	): Promise<GenerateSlotsResponse> => {
		const response = await api.post<GenerateSlotsResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.GENERATE}`,
			data,
		);
		return response.data;
	},
};
