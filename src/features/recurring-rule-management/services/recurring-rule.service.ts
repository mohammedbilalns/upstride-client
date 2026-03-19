import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	AddRecurringRuleInput,
	AddRecurringRuleResponse,
	DeleteRecurringRuleInput,
	DeleteRecurringRuleResponse,
	GetRecurringRulesResponse,
	ToggleRecurringRuleResponse,
	UpdateRecurringRuleInput,
	UpdateRecurringRuleResponse,
} from "../types";

export const recurringRuleService = {
	getRules: async (): Promise<GetRecurringRulesResponse> => {
		const response = await api.get<GetRecurringRulesResponse>(
			`${ROUTES.RECURRING_RULES.BASE}${ROUTES.RECURRING_RULES.ROOT}`,
		);
		return response.data;
	},

	addRule: async (
		data: AddRecurringRuleInput,
	): Promise<AddRecurringRuleResponse> => {
		const response = await api.post<AddRecurringRuleResponse>(
			`${ROUTES.RECURRING_RULES.BASE}${ROUTES.RECURRING_RULES.ROOT}`,
			data,
		);
		return response.data;
	},

	updateRule: async (
		data: UpdateRecurringRuleInput,
	): Promise<UpdateRecurringRuleResponse> => {
		const response = await api.patch<UpdateRecurringRuleResponse>(
			`${ROUTES.RECURRING_RULES.BASE}${ROUTES.RECURRING_RULES.BY_ID(
				data.ruleId,
			)}`,
			{ updates: data.updates },
		);
		return response.data;
	},

	deleteRule: async (
		data: DeleteRecurringRuleInput,
	): Promise<DeleteRecurringRuleResponse> => {
		const response = await api.delete<DeleteRecurringRuleResponse>(
			`${ROUTES.RECURRING_RULES.BASE}${ROUTES.RECURRING_RULES.BY_ID(
				data.ruleId,
			)}`,
		);
		return response.data;
	},

	enableRule: async (ruleId: string): Promise<ToggleRecurringRuleResponse> => {
		const response = await api.patch<ToggleRecurringRuleResponse>(
			`${ROUTES.RECURRING_RULES.BASE}${ROUTES.RECURRING_RULES.ENABLE(ruleId)}`,
		);
		return response.data;
	},

	disableRule: async (ruleId: string): Promise<ToggleRecurringRuleResponse> => {
		const response = await api.patch<ToggleRecurringRuleResponse>(
			`${ROUTES.RECURRING_RULES.BASE}${ROUTES.RECURRING_RULES.DISABLE(ruleId)}`,
		);
		return response.data;
	},
};
