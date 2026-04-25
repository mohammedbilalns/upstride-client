import { ArrowRight, CheckCircle } from "lucide-react";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/shared/utils/formValidation";
import type { OnboardingForm } from "./OnboardingView";

interface OnboardingInterestSelectionProps {
	form: OnboardingForm;
	catalog: Array<{ id: string; name: string }>;
	onNext: () => void;
}

export function OnboardingInterestSelection({
	form,
	catalog,
	onNext,
}: OnboardingInterestSelectionProps) {
	return (
		<form.Field name="interests">
			{(field) => (
				<div className="space-y-6">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">
							Personalize your journey
						</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Select 2–5 interests to continue.
						</p>
					</div>

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
					<FieldError message={getErrorMessage(field.state.meta.errors?.[0])} />

					<Button
						type="button"
						className="w-full"
						disabled={field.state.value.length < 2}
						onClick={onNext}
					>
						Next: Choose Skills
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			)}
		</form.Field>
	);
}
