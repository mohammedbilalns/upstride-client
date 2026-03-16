import { useForm } from "@tanstack/react-form";
import { GraduationCap, Plus, Save, Trash2 } from "lucide-react";
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
import FieldError from "@/components/common/Field-Error";
import { mentorSettingsSchema } from "../validators/platform-settings.schema";
import type { MentorSettingsConfig } from "../types";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/form-validation";

type MentorSettingsFormValues = Omit<MentorSettingsConfig, "tiers"> & {
	tiers: Array<
		Omit<
			MentorSettingsConfig["tiers"][number],
			| "rateForThirtyMinSession"
			| "rateForSixtyMinSession"
			| "minFreeArticlesPercentage"
			| "maxArticlesPerWeek"
			| "minSessionCompleted"
			| "minArticlesPublished"
		> & {
			rateForThirtyMinSession: number | "";
			rateForSixtyMinSession: number | "";
			minFreeArticlesPercentage: number | "";
			maxArticlesPerWeek: number | "";
			minSessionCompleted: number | "";
			minArticlesPublished: number | "";
		}
	>;
};

interface MentorSettingsProps {
	settings: MentorSettingsConfig;
	onUpdate: (data: MentorSettingsConfig) => Promise<void>;
	isLoading: boolean;
}

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

	const parseNumberInput = (value: string): number | "" =>
		value === "" ? "" : Number(value);
	const getErrorMessage = (errors: unknown) => {
		if (!errors) return undefined;
		if (Array.isArray(errors)) {
			const first = errors[0] as { message?: string } | undefined;
			return first?.message || first?.toString() || undefined;
		}
		if (typeof errors === "string") return errors;
		if (typeof errors === "object") {
			const message = (errors as { message?: string }).message;
			return message || String(errors);
		}
		return String(errors);
	};

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
							Define the progression path and requirements for mentors on the
							platform.
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6">
						<form.Field name="tiers" mode="array">
							{(field) => (
								<div className="space-y-6">
									{field.state.value.map((tier, i) => (
										<div
											key={tier.id}
											className="relative p-6 rounded-xl border border-border/60 bg-muted/5 space-y-4"
										>
											<div className="flex items-center justify-between">
												<h4 className="font-bold text-sm uppercase tracking-wider text-primary">
													Tier {i + 1}: {tier.name}
												</h4>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive hover:bg-destructive/10 h-8 w-8"
													type="button"
													onClick={() => {
														const newVal = field.state.value.filter(
															(_, index) => index !== i,
														);
														field.handleChange(newVal);
													}}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
												<form.Field name={`tiers[${i}].name` as const}>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">Tier Name</Label>
															<Input
																value={subField.state.value}
																onChange={(e) =>
																	subField.handleChange(e.target.value)
																}
																onBlur={subField.handleBlur}
															/>
															<FieldError
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
												<form.Field
													name={`tiers[${i}].rateForThirtyMinSession` as const}
												>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">30 Min Rate ($)</Label>
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
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
												<form.Field
													name={`tiers[${i}].rateForSixtyMinSession` as const}
												>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">60 Min Rate ($)</Label>
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
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
												<form.Field
													name={`tiers[${i}].maxArticlesPerWeek` as const}
												>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">
																Max Articles/Week
															</Label>
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
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/40">
												<form.Field
													name={`tiers[${i}].minSessionCompleted` as const}
												>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">
																Min Sessions Done
															</Label>
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
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
												<form.Field
													name={`tiers[${i}].minArticlesPublished` as const}
												>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">
																Min Articles Published
															</Label>
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
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
												<form.Field
													name={
														`tiers[${i}].minFreeArticlesPercentage` as const
													}
												>
													{(subField) => (
														<div className="space-y-2">
															<Label className="text-xs">Min Free %</Label>
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
																message={getErrorMessage(
																	subField.state.meta.errors,
																)}
															/>
														</div>
													)}
												</form.Field>
											</div>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										className="w-full border-2 border-dashed h-12 hover:bg-muted/50"
										onClick={() =>
											field.pushValue({
												id: Math.random().toString(36).substr(2, 9),
												name: "New Tier",
												rateForThirtyMinSession: 0,
												rateForSixtyMinSession: 0,
												minFreeArticlesPercentage: 100,
												maxArticlesPerWeek: 0,
												minSessionCompleted: 0,
												minArticlesPublished: 0,
											})
										}
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Achievement Tier
									</Button>
								</div>
							)}
						</form.Field>
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
				message="Changing mentor tiers and session rates will affect current mentor progression and future session bookings. Are you sure you want to continue?"
				variant="destructive"
				isLoading={isLoading}
				confirmText="Yes, Update Mentor Settings"
			/>
		</div>
	);
}
