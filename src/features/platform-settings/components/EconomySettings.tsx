import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
	getErrorMessage,
} from "@/shared/utils/form-validation";
import type { EconomySettingsConfig } from "../types";
import { economySettingsSchema } from "../validators/platform-settings.schema";
import { EconomySettingsCoinValueCard } from "./EconomySettingsCoinValueCard";
import { EconomySettingsPlatformCommissionsCard } from "./EconomySettingsPlatformCommissionsCard";
import { EconomySettingsRewardsLimitsCard } from "./EconomySettingsRewardsLimitsCard";
import { EconomySettingsSubscriptionPlansCard } from "./EconomySettingsSubscriptionPlansCard";

type EconomySettingsFormValues = Omit<
	EconomySettingsConfig,
	| "coinValue"
	| "platformCommissions"
	| "userJoinRewardCoinCount"
	| "maxCoinsEarnablePerDay"
	| "maxCoinsFromReadingPerDay"
	| "maxCoinsFromEngagementPerDay"
	| "subscriptions"
> & {
	coinValue: number | "";
	platformCommissions: {
		sessionPercentage: number | "";
		userTipRewardPercentage: number | "";
	};
	subscriptions: Array<
		Omit<EconomySettingsConfig["subscriptions"][number], "coinsCost"> & {
			coinsCost: number | "";
		}
	>;
	userJoinRewardCoinCount: number | "";
	maxCoinsEarnablePerDay: number | "";
	maxCoinsFromReadingPerDay: number | "";
	maxCoinsFromEngagementPerDay: number | "";
};

interface EconomySettingsProps {
	settings: EconomySettingsConfig;
	onUpdate: (data: EconomySettingsConfig) => Promise<void>;
	isLoading: boolean;
}

export type EconomySettingsForm = ReturnType<
	typeof useForm<EconomySettingsFormValues>
>;
export type FieldErrorGetter = (errors: unknown) => string;

export function EconomySettings({
	settings,
	onUpdate,
	isLoading,
}: EconomySettingsProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [pendingData, setPendingData] = useState<EconomySettingsConfig | null>(
		null,
	);

	const validateForm = (value: EconomySettingsFormValues) => {
		const emptyErrors = buildEmptyStringErrors(value);
		if (Object.keys(emptyErrors).length > 0) {
			return { fields: emptyErrors };
		}

		const parsed = economySettingsSchema.safeParse(value);
		return parsed.success
			? undefined
			: {
					fields: buildFieldErrorsFromIssues(parsed.error.issues),
				};
	};

	const form = useForm<EconomySettingsFormValues>({
		defaultValues: settings as EconomySettingsFormValues,
		validators: {
			onChange: ({ value }) => validateForm(value),
		},
		onSubmit: async ({ value }) => {
			const parsed = economySettingsSchema.safeParse(value);
			if (!parsed.success) return;
			setPendingData(parsed.data);
			setIsConfirmOpen(true);
		},
	});
	const handleConfirmUpdate = async () => {
		if (pendingData) {
			await onUpdate(pendingData);
			setIsConfirmOpen(false);
			setPendingData(null);
		}
	};

	const getFieldErrorMessage = (errors: unknown) =>
		getErrorMessage(errors) || String(errors);

	return (
		<div className="space-y-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<EconomySettingsCoinValueCard
					form={form}
					getFieldErrorMessage={getFieldErrorMessage}
				/>
				<EconomySettingsPlatformCommissionsCard
					form={form}
					getFieldErrorMessage={getFieldErrorMessage}
				/>
				<EconomySettingsSubscriptionPlansCard
					form={form}
					getFieldErrorMessage={getFieldErrorMessage}
				/>
				<EconomySettingsRewardsLimitsCard
					form={form}
					getFieldErrorMessage={getFieldErrorMessage}
				/>

				<div className="flex justify-end pt-4">
					<Button
						type="submit"
						size="lg"
						disabled={isLoading}
						className="px-8 shadow-md"
					>
						<Save className="w-4 h-4 mr-2" />
						Update Coin Settings
					</Button>
				</div>
			</form>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirmUpdate}
				title="Confirm Coin Settings Change"
				message="Are you sure you want to update core coin settings? This will immediately affect pricing and rewards for all users."
				variant="destructive"
				isLoading={isLoading}
				confirmText="Yes, Update Settings"
			/>
		</div>
	);
}
