export type AllowedDuration = 30 | 60;

export interface AvailabilityRule {
	ruleId: string;
	weekDay: number;
	startTime: number;
	endTime: number;
	slotDuration: AllowedDuration;
	isActive?: boolean;
}

export interface AddRecurringRuleInput {
	rule: {
		weekDay: number;
		startTime: number;
		endTime: number;
		slotDuration: AllowedDuration;
	};
}

export interface AddRecurringRuleResponse {
	message: string;
	data: {
		rule: AvailabilityRule;
	};
}

export interface UpdateRecurringRuleInput {
	ruleId: string;
	updates: {
		weekDay?: number;
		startTime?: number;
		endTime?: number;
		slotDuration?: AllowedDuration;
		isActive?: boolean;
	};
}

export interface UpdateRecurringRuleResponse {
	message: string;
	data: {
		rule: AvailabilityRule;
	};
}

export interface ToggleRecurringRuleResponse {
	message: string;
	data: {
		rule: AvailabilityRule;
	};
}

export interface DeleteRecurringRuleInput {
	ruleId: string;
}

export interface DeleteRecurringRuleResponse {
	message: string;
	data: {
		ruleId: string;
	};
}

export interface GetRecurringRulesResponse {
	message: string;
	data: {
		rules: AvailabilityRule[];
	};
}
