import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useOnboardingCatalog } from "../hooks/use-catalog";
import { useSaveInterests } from "../hooks/use-save-interests";
import { saveInterestsSchema } from "../validators";
import { OnboardingErrorState } from "./OnboardingErrorState";
import { OnboardingInterestSelection } from "./OnboardingInterestSelection";
import { OnboardingLoadingState } from "./OnboardingLoadingState";
import { OnboardingSkillsStep } from "./OnboardingSkillsStep";

interface Props {
	setupToken: string;
}

export const LEVEL_LABELS: Record<
	"BEGINNER" | "INTERMEDIATE" | "ADVANCED",
	string
> = {
	BEGINNER: "Beginner",
	INTERMEDIATE: "Intermediate",
	ADVANCED: "Advanced",
};

export type OnboardingForm = ReturnType<typeof useForm>;

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
		return <OnboardingLoadingState />;
	}

	if (catalogQuery.isError) {
		return <OnboardingErrorState onRetry={() => catalogQuery.refetch()} />;
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
			<OnboardingInterestSelection
				form={form}
				catalog={catalog}
				onNext={() => setStep(1)}
			/>
		);
	}

	/* ─── Steps 1…N: Skills per interest ───────────────────────── */
	if (!currentInterest) return null;

	return (
		<OnboardingSkillsStep
			form={form}
			currentInterest={currentInterest}
			step={step}
			totalSteps={totalSteps}
			stepLabel={stepLabel}
			isLastStep={isLastStep}
			nextInterestName={selectedInterests[step]?.name}
			apiError={apiError}
			onBack={() => setStep((s) => s - 1)}
			onNext={() => setStep((s) => s + 1)}
			isSaving={saveMutation.isPending}
		/>
	);
}
