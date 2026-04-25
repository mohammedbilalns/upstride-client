import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/shared/utils/formValidation";
import type { OnboardingForm } from "./OnboardingView";

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
						Select the skills that match this interest. Click again to remove a
						skill.
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
					<div className="space-y-3">
						{currentInterest.skills.map((skill) => {
							const isSelected = skillsField.state.value.includes(skill.id);

							return (
								<div
									key={skill.id}
									className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg border transition-colors ${
										isSelected
											? "bg-primary/5 border-primary/30"
											: "bg-background border-border hover:bg-muted/40"
									}`}
								>
									<div className="min-w-0">
										<p className="text-sm font-medium leading-none">
											{skill.name}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											{isSelected ? "Selected" : "Tap to add to this interest"}
										</p>
									</div>

									<button
										type="button"
										onClick={() => {
											if (isSelected) {
												skillsField.handleChange(
													skillsField.state.value.filter(
														(selected) => selected !== skill.id,
													),
												);
											} else {
												skillsField.handleChange([
													...skillsField.state.value,
													skill.id,
												]);
											}
										}}
										className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
											isSelected
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground"
										}`}
									>
										{isSelected && (
											<CheckCircle className="mr-1.5 h-3.5 w-3.5" />
										)}
										{isSelected ? "Remove" : "Add"}
									</button>
								</div>
							);
						})}
						<FieldError
							message={getErrorMessage(skillsField.state.meta.errors?.[0])}
						/>
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
