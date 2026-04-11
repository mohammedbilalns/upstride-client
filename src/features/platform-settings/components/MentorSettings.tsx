import { useForm } from "@tanstack/react-form";
import { GraduationCap, Save } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
	getErrorMessage,
	parseNumberInput,
} from "@/shared/utils/form-validation";
import type { MentorSettingsConfig } from "../types";
import { mentorSettingsSchema } from "../validators/platform-settings.schema";

type MentorTierFormValues = {
	level: number;
	name: string;
	minScore: number | "";
	maxScore: number | "";
	maxPricePer30Min: number | "";
};

type MentorSettingsFormValues = {
	starter: MentorTierFormValues;
	rising: MentorTierFormValues;
	expert: MentorTierFormValues;
};

interface MentorSettingsProps {
	settings: MentorSettingsConfig;
	onUpdate: (data: MentorSettingsConfig) => Promise<void>;
	isLoading: boolean;
}

const tierOrder = [
	{ key: "starter", label: "Starter" },
	{ key: "rising", label: "Rising" },
	{ key: "expert", label: "Expert" },
] as const;

export function MentorSettings({
	settings,
	onUpdate,
	isLoading,
}: MentorSettingsProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [pendingData, setPendingData] = useState<MentorSettingsConfig | null>(
		null,
	);

	const validateForm = (value: MentorSettingsFormValues) => {
		const emptyErrors = buildEmptyStringErrors(value);
		if (Object.keys(emptyErrors).length > 0) {
			return { fields: emptyErrors };
		}

		const parsed = mentorSettingsSchema.safeParse(value);
		return parsed.success
			? undefined
			: {
					fields: buildFieldErrorsFromIssues(parsed.error.issues),
				};
	};

	const form = useForm({
		defaultValues: settings as MentorSettingsFormValues,
		validators: {
			onChange: ({ value }) => validateForm(value),
		},
		onSubmit: async ({ value }) => {
			const parsed = mentorSettingsSchema.safeParse(value);
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
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="bg-muted/30 pt-6">
						<CardTitle className="flex items-center gap-2 text-xl">
							<GraduationCap className="w-5 h-5 text-primary" />
							Mentor Tiers
						</CardTitle>
						<CardDescription>
							Only the max price per 30 minutes can be updated. Tier names and
							score ranges are locked.
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="space-y-6">
							{tierOrder.map((tier) => (
								<div
									key={tier.key}
									className="relative p-6 rounded-xl border border-border/60 bg-muted/5 space-y-4"
								>
									<div className="flex items-center justify-between">
										<h4 className="font-bold text-sm uppercase tracking-wider text-primary">
											{tier.label} Tier
										</h4>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										<form.Field name={`${tier.key}.name`}>
											{(subField) => (
												<div className="space-y-2">
													<Label className="text-xs">Tier Name</Label>
													<Input
														value={subField.state.value}
														disabled
														onChange={(e) =>
															subField.handleChange(e.target.value)
														}
														onBlur={subField.handleBlur}
													/>
													<FieldError
														message={getFieldErrorMessage(
															subField.state.meta.errors,
														)}
													/>
												</div>
											)}
										</form.Field>
										<form.Field name={`${tier.key}.minScore`}>
											{(subField) => (
												<div className="space-y-2">
													<Label className="text-xs">Min Score</Label>
													<Input
														type="number"
														value={subField.state.value ?? ""}
														disabled
														onChange={(e) =>
															subField.handleChange(
																parseNumberInput(e.target.value),
															)
														}
														onBlur={subField.handleBlur}
													/>
													<FieldError
														message={getFieldErrorMessage(
															subField.state.meta.errors,
														)}
													/>
												</div>
											)}
										</form.Field>
										<form.Field name={`${tier.key}.maxScore`}>
											{(subField) => (
												<div className="space-y-2">
													<Label className="text-xs">Max Score</Label>
													<Input
														type="number"
														value={subField.state.value ?? ""}
														disabled
														onChange={(e) =>
															subField.handleChange(
																parseNumberInput(e.target.value),
															)
														}
														onBlur={subField.handleBlur}
													/>
													<FieldError
														message={getFieldErrorMessage(
															subField.state.meta.errors,
														)}
													/>
												</div>
											)}
										</form.Field>
										<form.Field name={`${tier.key}.maxPricePer30Min`}>
											{(subField) => (
												<div className="space-y-2">
													<Label className="text-xs">Max Price / 30 Min</Label>
													<Input
														type="number"
														value={subField.state.value ?? ""}
														onChange={(e) =>
															subField.handleChange(
																parseNumberInput(e.target.value),
															)
														}
														onBlur={subField.handleBlur}
													/>
													<FieldError
														message={getFieldErrorMessage(
															subField.state.meta.errors,
														)}
													/>
												</div>
											)}
										</form.Field>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end pt-4">
					<Button
						type="submit"
						size="lg"
						disabled={isLoading}
						className="px-8 shadow-md"
					>
						<Save className="w-4 h-4 mr-2" />
						Update Mentor Configurations
					</Button>
				</div>
			</form>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirmUpdate}
				title="Confirm Mentor Settings Change"
				message="Changing mentor tiers, score ranges, and pricing caps will affect current mentor progression and future session bookings. Are you sure you want to continue?"
				variant="destructive"
				isLoading={isLoading}
				confirmText="Yes, Update Mentor Settings"
			/>
		</div>
	);
}
