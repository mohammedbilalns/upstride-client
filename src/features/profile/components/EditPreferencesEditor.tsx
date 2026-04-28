import { useForm } from "@tanstack/react-form";
import { Loader2, Plus, Target, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useOnboardingCatalog } from "@/features/onboarding/hooks/queries/useCatalog";
import type { CatalogInterest } from "@/features/onboarding/types";
import { UserPreferencesLimits } from "@/features/onboarding/validators/onboarding.schema";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";
import type { UserProfile } from "../types";
import {
	type ProfilePreferencesFormValues,
	profilePreferencesSchema,
} from "../validators/preferences.schema";

interface EditPreferencesEditorProps {
	profile: UserProfile;
	onDone: () => void;
	onCancel: () => void;
}

export function EditPreferencesEditor({
	profile,
	onDone,
	onCancel,
}: EditPreferencesEditorProps) {
	const catalogQuery = useOnboardingCatalog();
	const [isInterestMenuOpen, setIsInterestMenuOpen] = useState(false);

	const updateProfileMutation = useUpdateProfile({
		onSuccess: () => {
			toast.success("Preferences updated successfully");
			onDone();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update preferences");
		},
	});

	const initialValues = useMemo<ProfilePreferencesFormValues>(
		() => ({
			interests:
				profile.preferences?.interests.map((interest) => interest.id) ?? [],
			skills:
				profile.preferences?.interests.flatMap((interest) =>
					interest.skills.map((skill) => skill.skillId),
				) ?? [],
		}),
		[profile.preferences],
	);

	const form = useForm<ProfilePreferencesFormValues>({
		defaultValues: initialValues,
		validators: {
			onSubmit: profilePreferencesSchema,
		},
		onSubmit: async ({ value }) => {
			await updateProfileMutation.mutateAsync(value);
		},
	});

	useEffect(() => {
		form.reset();
		form.setFieldValue("interests", initialValues.interests);
		form.setFieldValue("skills", initialValues.skills);
	}, [form, initialValues]);

	const catalog = catalogQuery.data?.interests ?? [];
	const catalogById = useMemo(() => {
		const map = new Map<string, CatalogInterest>();
		catalog.forEach((interest) => {
			map.set(interest.id, interest);
		});
		return map;
	}, [catalog]);

	const removeInterest = (interestId: string) => {
		const interest = catalogById.get(interestId);
		const currentInterests = form.getFieldValue("interests");
		const currentSkills = form.getFieldValue("skills");
		if (!interest) return;

		form.setFieldValue(
			"interests",
			currentInterests.filter((id) => id !== interestId),
		);
		form.setFieldValue(
			"skills",
			currentSkills.filter(
				(skillId) => !interest.skills.some((skill) => skill.id === skillId),
			),
		);
	};

	const toggleSkill = (skillId: string) => {
		const currentSkills = form.getFieldValue("skills");
		if (currentSkills.includes(skillId)) {
			form.setFieldValue(
				"skills",
				currentSkills.filter((id) => id !== skillId),
			);
			return;
		}

		form.setFieldValue("skills", [...currentSkills, skillId]);
	};

	return (
		<Card className="border-border/60 shadow-sm overflow-hidden">
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<div className="space-y-1">
					<CardTitle className="flex items-center gap-2 text-xl">
						<Target className="h-5 w-5 text-primary" />
						Edit Learning Preferences
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Pick {UserPreferencesLimits.MIN_INTERESTS} to{" "}
						{UserPreferencesLimits.MAX_INTERESTS} interests and at least{" "}
						{UserPreferencesLimits.MIN_SKILLS_PER_INTEREST} skills before
						saving.
					</p>
				</div>
				<Button type="button" variant="ghost" size="sm" onClick={onCancel}>
					Cancel
				</Button>
			</CardHeader>

			<CardContent className="space-y-6">
				{catalogQuery.isLoading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : catalogQuery.isError ? (
					<div className="space-y-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
						<p className="font-medium text-destructive">
							Unable to load interests and skills.
						</p>
						<Button
							type="button"
							variant="outline"
							onClick={() => catalogQuery.refetch()}
						>
							Retry
						</Button>
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<form.Subscribe
							selector={(state) => ({
								interests: state.values.interests,
								skills: state.values.skills,
							})}
						>
							{({ interests: selectedInterestIds, skills: selectedSkills }) => {
								const selectedSkillIds = new Set(selectedSkills);
								const availableInterests = catalog.filter(
									(interest) => !selectedInterestIds.includes(interest.id),
								);

								return (
									<div className="space-y-4">
										<div className="flex items-center justify-between gap-3">
											<div>
												<p className="text-sm font-semibold">
													Selected interests
												</p>
												<p className="text-xs text-muted-foreground">
													{selectedInterestIds.length} selected of{" "}
													{UserPreferencesLimits.MAX_INTERESTS}
												</p>
											</div>
										</div>

										{selectedInterestIds.length === 0 ? (
											<div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
												Add interests from the dropdown below to start selecting
												skills.
											</div>
										) : (
											<div className="space-y-3">
												{selectedInterestIds.map((interestId) => {
													const interest = catalogById.get(interestId);
													if (!interest) return null;

													return (
														<div
															key={interest.id}
															className="rounded-2xl border border-border/60 bg-muted/10 p-4 space-y-3"
														>
															<div className="flex items-center justify-between gap-3">
																<div className="space-y-0.5">
																	<p className="text-sm font-semibold">
																		{interest.name}
																	</p>
																</div>
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	className="text-muted-foreground hover:text-destructive"
																	onClick={() => removeInterest(interest.id)}
																>
																	<X className="mr-2 h-4 w-4" />
																	Remove
																</Button>
															</div>

															<div className="flex flex-wrap gap-2">
																{interest.skills.map((skill) => {
																	const isSelected = selectedSkillIds.has(
																		skill.id,
																	);
																	return (
																		<button
																			key={skill.id}
																			type="button"
																			onClick={() => toggleSkill(skill.id)}
																			className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
																				isSelected
																					? "border-primary bg-primary text-primary-foreground"
																					: "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground"
																			}`}
																		>
																			{isSelected && <CheckMark />}
																			{skill.name}
																		</button>
																	);
																})}
															</div>
														</div>
													);
												})}
											</div>
										)}

										<div className="rounded-2xl border border-dashed border-border/60 bg-muted/5 p-4 space-y-3">
											<div className="flex items-center justify-between gap-3">
												<div>
													<p className="text-sm font-semibold">Add interest</p>
													<p className="text-xs text-muted-foreground">
														{selectedInterestIds.length >=
														UserPreferencesLimits.MAX_INTERESTS
															? "Maximum interests reached"
															: "Choose an interest from the list and add it"}
													</p>
												</div>
											</div>

											<div className="space-y-3">
												<Button
													type="button"
													variant="outline"
													className="w-full justify-between rounded-xl"
													onClick={() => setIsInterestMenuOpen((open) => !open)}
													disabled={
														availableInterests.length === 0 ||
														selectedInterestIds.length >=
															UserPreferencesLimits.MAX_INTERESTS
													}
												>
													<span>Select a new interest</span>
													<Plus className="h-4 w-4" />
												</Button>

												{isInterestMenuOpen && (
													<div className="rounded-xl border border-border/60 bg-background p-2 shadow-xl">
														<div className="max-h-56 overflow-y-auto space-y-1">
															{availableInterests.map((interest) => (
																<button
																	key={interest.id}
																	type="button"
																	className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
																	onClick={() => {
																		const nextInterests = [
																			...selectedInterestIds,
																			interest.id,
																		];
																		form.setFieldValue(
																			"interests",
																			nextInterests,
																		);
																		setIsInterestMenuOpen(false);
																	}}
																>
																	{interest.name}
																</button>
															))}
														</div>
														<div className="mt-2 flex justify-end">
															<Button
																type="button"
																variant="ghost"
																size="sm"
																onClick={() => setIsInterestMenuOpen(false)}
															>
																Close
															</Button>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								);
							}}
						</form.Subscribe>

						<form.Field name="interests">
							{(field) => (
								<FieldError
									message={getErrorMessage(field.state.meta.errors?.[0])}
								/>
							)}
						</form.Field>

						<form.Field name="skills">
							{(field) => (
								<FieldError
									message={getErrorMessage(field.state.meta.errors?.[0])}
								/>
							)}
						</form.Field>

						<div className="flex items-center justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={updateProfileMutation.isPending}
							>
								Discard
							</Button>
							<form.Subscribe selector={(state) => state.isSubmitting}>
								{(isSubmitting) => (
									<Button
										type="submit"
										disabled={isSubmitting || updateProfileMutation.isPending}
									>
										{(isSubmitting || updateProfileMutation.isPending) && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Update Preferences
									</Button>
								)}
							</form.Subscribe>
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}

function CheckMark() {
	return (
		<span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-current" />
	);
}
