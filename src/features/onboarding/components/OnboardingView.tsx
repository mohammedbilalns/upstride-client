import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { useOnboardingCatalog } from "../hooks/use-catalog";
import { useSaveInterests } from "../hooks/use-save-interests";
import { saveInterestsSchema } from "../validators";

interface Props {
	setupToken: string;
}

const LEVEL_LABELS: Record<"BEGINNER" | "INTERMEDIATE" | "ADVANCED", string> = {
	BEGINNER: "Beginner",
	INTERMEDIATE: "Intermediate",
	ADVANCED: "Advanced",
};

export function OnboardingView({ setupToken }: Props) {
	const router = useRouter();
	const catalogQuery = useOnboardingCatalog();
	const [apiError, setApiError] = useState<string | null>(null);

	/**
	 * step === 0  →  interest selection
	 * step === 1  →  skills for selectedInterests[0]
	 * step === 2  →  skills for selectedInterests[1]
	 * …and so on
	 */
	const [step, setStep] = useState(0);

	const saveMutation = useSaveInterests({
		onSuccess: async () => {
			await router.navigate({ to: "/home" });
		},
		onError: (
			error: Error | { response?: { data?: { message?: string } } },
		) => {
			const errorData = error as { response?: { data?: { message?: string } } };
			setApiError(
				errorData.response?.data?.message ??
					"Failed to save preferences. Please try again.",
			);
		},
	});

	const form = useForm({
		defaultValues: {
			setupToken,
			interests: [] as string[],
			skills: [] as {
				skillId: string;
				level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
			}[],
		},
		validators: { onSubmit: saveInterestsSchema },
		onSubmit: async ({ value }) => {
			setApiError(null);
			saveMutation.mutate(value);
		},
	});

	/* ─── Loading / error states ───────────────────────────────── */
	if (catalogQuery.isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (catalogQuery.isError) {
		return (
			<div className="text-center space-y-4 py-8">
				<p className="text-destructive font-medium">Failed to load catalog.</p>
				<Button onClick={() => catalogQuery.refetch()} variant="outline">
					Try again
				</Button>
			</div>
		);
	}

	const catalog = catalogQuery.data?.interests ?? [];

	/* ─── Derived values ────────────────────────────────────────── */
	const selectedInterestIds = form.getFieldValue("interests");

	// Map selectedInterestId → full CatalogInterest object (preserves selection order)
	const selectedInterests = selectedInterestIds
		.map((id) => catalog.find((c) => c.id === id))
		.filter(Boolean) as typeof catalog;

	// Total steps: 0 (interests) + N skill steps
	const totalSteps = 1 + selectedInterests.length;

	// Progress indicator (step 0 = "1 of N", skill steps = "2 of N" etc.)
	const stepLabel = `Step ${step + 1} of ${totalSteps}`;

	// The interest whose skills we're editing right now (step >= 1)
	const currentInterest = step >= 1 ? selectedInterests[step - 1] : null;

	const isLastStep = step === totalSteps - 1;

	/* ─── Step 0: Interest selection ───────────────────────────── */
	if (step === 0) {
		return (
			<form.Field name="interests">
				{(field) => (
					<div className="space-y-6">
						{/* Header */}
						<div>
							<h2 className="text-2xl font-bold tracking-tight">
								Personalize your journey
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Select 2–5 interests to continue.
							</p>
						</div>

						{/* Interest pills */}
						<div className="flex flex-wrap gap-2">
							{catalog.map((interest) => {
								const isSelected = field.state.value.includes(interest.id);
								const atMax = field.state.value.length >= 5;
								return (
									<button
										key={interest.id}
										type="button"
										disabled={!isSelected && atMax}
										onClick={() => {
											if (isSelected) {
												field.handleChange(
													field.state.value.filter((id) => id !== interest.id),
												);
											} else if (!atMax) {
												field.handleChange([...field.state.value, interest.id]);
											}
										}}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
											isSelected
												? "bg-primary text-primary-foreground border-primary"
												: atMax
													? "border-border text-muted-foreground opacity-40 cursor-not-allowed"
													: "bg-background text-foreground border-border hover:bg-muted"
										}`}
									>
										{isSelected && (
											<CheckCircle className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
										)}
										{interest.name}
									</button>
								);
							})}
						</div>

						<p className="text-xs text-muted-foreground">
							{field.state.value.length} / 5 selected
						</p>
						<FieldError message={field.state.meta.errors?.[0]?.message} />

						<Button
							type="button"
							className="w-full"
							disabled={field.state.value.length < 2}
							onClick={() => setStep(1)}
						>
							Next: Choose Skills
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				)}
			</form.Field>
		);
	}

	/* ─── Steps 1…N: Skills per interest ───────────────────────── */
	if (!currentInterest) return null;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			{/* Header */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setStep((s) => s - 1)}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<div className="flex-1">
					<p className="text-xs font-semibold text-primary uppercase tracking-widest mb-0.5">
						{stepLabel}
					</p>
					<h2 className="text-2xl font-bold tracking-tight">
						{currentInterest.name}
					</h2>
					<p className="text-sm text-muted-foreground mt-0.5">
						Choose your skill level for each area you know (click the same level
						to deselect).
					</p>
				</div>
			</div>

			{/* Progress bar */}
			<div className="w-full bg-muted rounded-full h-1.5">
				<div
					className="bg-primary rounded-full h-1.5 transition-all"
					style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
				/>
			</div>

			{apiError && (
				<div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
					{apiError}
				</div>
			)}

			<form.Field name="skills">
				{(skillsField) => (
					<div className="grid grid-cols-2 gap-2">
						{currentInterest.skills.map((skill) => {
							const existingIndex = skillsField.state.value.findIndex(
								(s) => s.skillId === skill.id,
							);
							const isSelected = existingIndex !== -1;
							const currentLevel = isSelected
								? skillsField.state.value[existingIndex].level
								: null;

							return (
								<div
									key={skill.id}
									className={`flex flex-col gap-2 px-3 py-2.5 rounded-lg border transition-colors ${
										isSelected
											? "bg-primary/5 border-primary/30"
											: "bg-background border-border hover:bg-muted/40"
									}`}
								>
									<span className="text-sm font-medium leading-none">
										{skill.name}
									</span>

									<div className="flex items-center gap-1.5">
										{(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map(
											(level) => (
												<button
													key={level}
													type="button"
													onClick={() => {
														const newValue = [...skillsField.state.value];
														if (isSelected) {
															if (currentLevel === level) {
																newValue.splice(existingIndex, 1);
															} else {
																newValue[existingIndex] = {
																	skillId: skill.id,
																	level,
																};
															}
														} else {
															newValue.push({ skillId: skill.id, level });
														}
														skillsField.handleChange(newValue);
													}}
													className={`flex-1 text-xs py-1 rounded-md font-medium transition-colors ${
														isSelected && currentLevel === level
															? "bg-primary text-primary-foreground"
															: "bg-background border border-border text-muted-foreground hover:bg-muted"
													}`}
												>
													{LEVEL_LABELS[level]}
												</button>
											),
										)}
									</div>
								</div>
							);
						})}
						<FieldError message={skillsField.state.meta.errors?.[0]?.message} />
					</div>
				)}
			</form.Field>

			{isLastStep ? (
				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || saveMutation.isPending}
						>
							{(isSubmitting || saveMutation.isPending) && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Complete Onboarding
						</Button>
					)}
				</form.Subscribe>
			) : (
				<Button
					type="button"
					className="w-full"
					onClick={() => setStep((s) => s + 1)}
				>
					Next: {selectedInterests[step]?.name}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			)}
		</form>
	);
}
