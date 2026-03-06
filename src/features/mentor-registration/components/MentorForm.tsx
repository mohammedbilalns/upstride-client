import { useForm } from "@tanstack/react-form";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	useRegisterMentor,
	useResubmitMentor,
} from "@/features/mentor-registration/hooks/use-mentor-registration";
import type {
	Mentor,
	MentorExperience,
	MentorSkill,
} from "@/features/mentor-registration/types";
import {
	registerMentorSchema,
	resubmitMentorSchema,
} from "@/features/mentor-registration/validators/mentor-registration.schema";
import { useOnboardingCatalog } from "@/features/onboarding/hooks/use-catalog";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { ExpertiseSection } from "./ExpertiseSection";
import { ProfessionalSummarySection } from "./ProfessionalSummarySection";

interface MentorFormProps {
	existingProfile: Mentor | null;
	onCancel?: () => void;
}

export function MentorForm({ existingProfile, onCancel }: MentorFormProps) {
	const catalogQuery = useOnboardingCatalog();
	const registerMutation = useRegisterMentor();
	const resubmitMutation = useResubmitMentor();
	const [isUploading, setIsUploading] = useState(false);

	const form = useForm({
		defaultValues: {
			bio: existingProfile?.bio || "",
			currentRoleId: existingProfile?.currentRoleId || "",
			organization: existingProfile?.organization || "",
			yearsOfExperience: existingProfile?.yearsOfExperience || 0,
			personalWebsite: existingProfile?.personalWebsite || "",
			resumeId: existingProfile?.resumeId || "",
			educationalQualifications: existingProfile?.educationalQualifications || [
				"",
			],
			areasOfExpertise: existingProfile?.areasOfExpertise || [],
			toolsAndSkills: (existingProfile?.toolsAndSkills as MentorSkill[]) || [],
			experience: (existingProfile?.experience as MentorExperience[]) || [
				{
					company: "",
					role: "",
					description: "",
					from: "",
					to: null,
				},
			],
		},
		validators: {
			onSubmit: (existingProfile
				? resubmitMentorSchema
				: registerMentorSchema) as any,
		},
		onSubmit: async ({ value }) => {
			if (existingProfile) {
				await resubmitMutation.mutateAsync(value);
			} else {
				await registerMutation.mutateAsync(value);
			}
		},
		onSubmitInvalid: () => {
			toast.error("Please fill in all the required fields correctly.");
		},
	});

	const getErrorMessage = (errors: any[]) => {
		return errors?.[0]?.message || errors?.[0]?.toString() || undefined;
	};

	if (catalogQuery.isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	const interests = catalogQuery.data?.interests || [];

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="space-y-10 pb-20"
		>
			<div className="grid gap-8">
				<ProfessionalSummarySection
					form={form}
					getErrorMessage={getErrorMessage}
				/>
				<ExpertiseSection
					form={form}
					interests={interests}
					getErrorMessage={getErrorMessage}
				/>
				<ExperienceSection form={form} getErrorMessage={getErrorMessage} />
				<EducationSection
					form={form}
					isUploading={isUploading}
					setIsUploading={setIsUploading}
					getErrorMessage={getErrorMessage}
					existingProfile={existingProfile}
				/>
			</div>

			<div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-4 z-40">
				<div className="container max-w-4xl flex items-center justify-between gap-4">
					{onCancel && (
						<Button
							type="button"
							variant="ghost"
							onClick={onCancel}
							className="rounded-full"
						>
							Cancel
						</Button>
					)}
					<form.Subscribe
						selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty]}
					>
						{([canSubmit, isSubmitting, isDirty]) => (
							<Button
								type="submit"
								className={`rounded-full px-10 h-12 text-base font-semibold shadow-lg transition-all ${
									onCancel ? "ml-auto" : "w-full sm:w-auto ml-auto"
								} ${canSubmit && (!existingProfile || isDirty) ? "shadow-primary/25" : ""}`}
								disabled={
									!canSubmit ||
									isSubmitting ||
									isUploading ||
									(!!existingProfile && !isDirty)
								}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									<>
										{existingProfile
											? "Update Application"
											: "Submit Application"}
										<ArrowRight className="ml-2 h-4 w-4" />
									</>
								)}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</div>
		</form>
	);
}
