import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { mentorProfileService } from "@/features/mentor-profile";
import { mentorProfileSchema } from "@/features/mentor-profile/validators/mentor-profile.schema";
import { EditMentorProfilePricingAndBioFields } from "./EditMentorProfilePricingAndBioFields";
import { EditMentorProfileQualificationsSection } from "./EditMentorProfileQualificationsSection";
import { EditMentorProfileSkillsSection } from "./EditMentorProfileSkillsSection";

export type EditMentorProfileForm = ReturnType<typeof useForm>;
export type PendingSkill = {
	skillId: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};

export function EditMentorProfileModal({
	isOpen,
	onClose,
	profile,
	catalogData,
}: {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	profile: any;
	catalogData: any;
}) {
	const queryClient = useQueryClient();
	const [skillError, setSkillError] = useState<string | null>(null);
	const [qualificationError, setQualificationError] = useState<string | null>(
		null,
	);
	const [pendingSkills, setPendingSkills] = useState<PendingSkill[]>([]);
	const [pendingQualifications, setPendingQualifications] = useState<string[]>(
		[],
	);

	const updateMutation = useMutation({
		mutationFn: mentorProfileService.updateProfile,
		onSuccess: () => {
			toast.success("Profile updated");
			queryClient.invalidateQueries({ queryKey: ["mentor-profile"] });
			onClose(false);
			setPendingSkills([]);
			setPendingQualifications([]);
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data?.message || "Failed to update profile");
		},
	});

	const form = useForm({
		defaultValues: {
			currentPricePer30Min: "",
			bio: "",
			newSkillId: "",
			newSkillLevel: "BEGINNER",
			newQualification: "",
		},
		onSubmit: async ({ value }) => {
			const result = mentorProfileSchema.safeParse(value);
			if (!result.success) return;

			const payload = {
				currentPricePer30Min:
					value.currentPricePer30Min && value.currentPricePer30Min.trim() !== ""
						? Number(value.currentPricePer30Min)
						: undefined,
				bio: value.bio.trim(),
				addSkills: pendingSkills.length ? pendingSkills : undefined,
				addEducationalQualifications: pendingQualifications.length
					? pendingQualifications
					: undefined,
			};

			updateMutation.mutate(payload);
		},
		validators: {
			onSubmit: mentorProfileSchema,
		},
	});

	useEffect(() => {
		if (isOpen && profile) {
			form.reset();
			form.setFieldValue(
				"currentPricePer30Min",
				profile.currentPricePer30Min
					? String(profile.currentPricePer30Min)
					: "",
			);
			form.setFieldValue("bio", profile.bio || "");
			form.setFieldValue("newSkillId", "");
			form.setFieldValue("newSkillLevel", "BEGINNER");
			form.setFieldValue("newQualification", "");
			setPendingSkills([]);
			setPendingQualifications([]);
			setSkillError(null);
			setQualificationError(null);
		}
	}, [isOpen, profile]);

	const skillNameById = useMemo(() => {
		const map = new Map<string, string>();
		catalogData?.data.interests
			.flatMap((interest: any) => interest.skills)
			.forEach((skill: any) => {
				map.set(skill.id, skill.name);
			});
		return map;
	}, [catalogData]);

	const getSkillName = (skillId: string) =>
		skillNameById.get(skillId) ?? skillId;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				onClose(open);
				if (!open) {
					form.reset();
					setSkillError(null);
					setQualificationError(null);
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Mentor Profile</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<EditMentorProfilePricingAndBioFields form={form} profile={profile} />
					<EditMentorProfileSkillsSection
						form={form}
						profile={profile}
						catalogData={catalogData}
						pendingSkills={pendingSkills}
						setPendingSkills={setPendingSkills}
						skillError={skillError}
						setSkillError={setSkillError}
						getSkillName={getSkillName}
					/>
					<EditMentorProfileQualificationsSection
						form={form}
						pendingQualifications={pendingQualifications}
						setPendingQualifications={setPendingQualifications}
						qualificationError={qualificationError}
						setQualificationError={setQualificationError}
					/>
					<DialogFooter>
						<Button type="submit" disabled={updateMutation.isPending}>
							Save Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
