import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import type { OnboardingForm } from "./OnboardingView";
import { LEVEL_LABELS } from "./OnboardingView";

interface OnboardingSkillsStepProps {
	form: OnboardingForm;
	currentInterest: {
		id: string;
		name: string;
		skills: Array<{ id: string; name: string }>;
	};
	step: number;
	totalSteps: number;
	stepLabel: string;
	isLastStep: boolean;
	nextInterestName?: string;
	apiError: string | null;
	onBack: () => void;
	onNext: () => void;
	isSaving: boolean;
}

export function OnboardingSkillsStep({
	form,
	currentInterest,
	step,
	totalSteps,
	stepLabel,
	isLastStep,
	nextInterestName,
	apiError,
	onBack,
	onNext,
	isSaving,
}: OnboardingSkillsStepProps) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onBack}
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
							disabled={isSubmitting || isSaving}
						>
							{(isSubmitting || isSaving) && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Complete Onboarding
						</Button>
					)}
				</form.Subscribe>
			) : (
				<Button type="button" className="w-full" onClick={onNext}>
					Next: {nextInterestName}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			)}
		</form>
	);
}
