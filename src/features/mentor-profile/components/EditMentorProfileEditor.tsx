import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { Button } from "@/components/ui/Button";
import { mentorProfileService } from "@/features/mentor-profile";
import { mentorProfileSchema } from "@/features/mentor-profile/validators/mentor-profile.schema";
import { useProfessions } from "@/features/mentor-registration/hooks/queries/useCatalog";
import type { CatalogInterest } from "@/features/onboarding/types";
import type { MentorProfileResponse } from "../types";
import { EditMentorProfileExpertiseSection } from "./EditMentorProfileExpertiseSection";
import { EditMentorProfilePricingAndBioFields } from "./EditMentorProfilePricingAndBioFields";
import { EditMentorProfileQualificationsSection } from "./EditMentorProfileQualificationsSection";
import { EditMentorProfileSkillsSection } from "./EditMentorProfileSkillsSection";

export type EditMentorProfileFormValues = {
	currentRoleId: string;
	organization: string;
	areasOfExpertise: string[];
	currentPricePer30Min: string;
	bio: string;
	newSkillId: string;
	newSkillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	newQualification: string;
};
export type EditMentorProfileForm = ReturnType<
	typeof useForm<EditMentorProfileFormValues>
>;
export type PendingSkill = {
	skillId: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};
type QualificationRow = {
	id: string;
	value: string;
};

function createQualificationRow(value: string): QualificationRow {
	return {
		id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
		value,
	};
}

export function EditMentorProfileEditor({
	profile,
	catalogData,
	onDone,
	onCancel,
}: {
	profile: MentorProfileResponse["profile"] | null | undefined;
	catalogData:
		| {
				data: {
					interests: CatalogInterest[];
				};
		  }
		| null
		| undefined;
	onDone: () => void;
	onCancel: () => void;
}) {
	const queryClient = useQueryClient();
	const [skillError, setSkillError] = useState<string | null>(null);
	const [qualificationError, setQualificationError] = useState<string | null>(
		null,
	);
	const [pendingSkills, setPendingSkills] = useState<PendingSkill[]>([]);
	const [removedSkillIds, setRemovedSkillIds] = useState<string[]>([]);
	const [qualificationRows, setQualificationRows] = useState<
		QualificationRow[]
	>([]);
	const [newQualification, setNewQualification] = useState("");
	const { data: professions } = useProfessions();

	const updateMutation = useMutation({
		mutationFn: mentorProfileService.updateProfile,
		onSuccess: () => {
			toast.success("Mentor profile updated successfully");
			queryClient.invalidateQueries({ queryKey: ["mentor-profile"] });
			setPendingSkills([]);
			setRemovedSkillIds([]);
			setQualificationRows([]);
			setNewQualification("");
			onDone();
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data?.message || "Failed to update profile");
		},
	});

	const form = useForm({
		defaultValues: {
			currentRoleId: "",
			organization: "",
			areasOfExpertise: [] as string[],
			currentPricePer30Min: "",
			bio: "",
			newSkillId: "",
			newSkillLevel: "BEGINNER",
			newQualification: "",
		},
		onSubmit: async ({ value }) => {
			const payload = {
				currentRoleId: value.currentRoleId,
				organization: value.organization.trim(),
				areasOfExpertise: value.areasOfExpertise,
				currentPricePer30Min:
					value.currentPricePer30Min && value.currentPricePer30Min.trim() !== ""
						? Number(value.currentPricePer30Min)
						: undefined,
				bio: value.bio.trim(),
				educationalQualifications: qualificationRows
					.map((qualification) => qualification.value.trim())
					.filter((qualification) => qualification.length > 0),
				addSkills: pendingSkills.length ? pendingSkills : undefined,
				removeSkills: (() => {
					const pendingSkillIds = new Set(
						pendingSkills.map((skill) => skill.skillId),
					);
					const selectedExpertiseIds = value.areasOfExpertise;
					const removedExpertiseIds = (profile?.expertises ?? [])
						.map((expertise) => expertise.id)
						.filter((id) => !selectedExpertiseIds.includes(id));
					const removedExpertiseSkillIds = removedExpertiseIds.flatMap(
						(interestId) => interestSkillIdsById.get(interestId) ?? [],
					);
					const next = Array.from(
						new Set([...removedSkillIds, ...removedExpertiseSkillIds]),
					).filter((skillId) => !pendingSkillIds.has(skillId));
					return next.length ? next : undefined;
				})(),
			};

			updateMutation.mutate(payload);
		},
		validators: {
			onSubmit: mentorProfileSchema,
		},
	});

	useEffect(() => {
		if (profile) {
			form.reset();
			form.setFieldValue("currentRoleId", profile.currentRole.id);
			form.setFieldValue("organization", profile.organization || "");
			form.setFieldValue(
				"areasOfExpertise",
				profile.expertises.map((expertise) => expertise.id),
			);
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
			setQualificationRows(
				profile.educationalQualifications.map((qualification) =>
					createQualificationRow(qualification),
				),
			);
			setNewQualification("");
			setPendingSkills([]);
			setRemovedSkillIds([]);
			setSkillError(null);
			setQualificationError(null);
		}
	}, [profile, form.reset, form.setFieldValue]);

	const skillInterestById = useMemo(() => {
		const map = new Map<string, string>();
		catalogData?.data.interests.forEach((interest) => {
			interest.skills.forEach((skill) => {
				map.set(skill.id, interest.id);
			});
		});
		return map;
	}, [catalogData]);

	const interestSkillIdsById = useMemo(() => {
		const map = new Map<string, string[]>();
		catalogData?.data.interests.forEach((interest) => {
			map.set(
				interest.id,
				interest.skills.map((skill) => skill.id),
			);
		});
		return map;
	}, [catalogData]);

	const skillNameById = useMemo(() => {
		const map = new Map<string, string>();
		catalogData?.data.interests
			.flatMap((interest) => interest.skills)
			.forEach((skill) => {
				map.set(skill.id, skill.name);
			});
		return map;
	}, [catalogData]);

	const getSkillName = (skillId: string) =>
		skillNameById.get(skillId) ?? skillId;

	const handleExpertiseChange = (nextExpertiseIds: string[]) => {
		const currentExpertiseIds = (profile?.expertises ?? []).map(
			(expertise) => expertise.id,
		);
		const removedExpertiseIds = currentExpertiseIds.filter(
			(id) => !nextExpertiseIds.includes(id),
		);

		const removedSkillIdsForExpertise = removedExpertiseIds.flatMap(
			(interestId) => interestSkillIdsById.get(interestId) ?? [],
		);

		if (removedSkillIdsForExpertise.length > 0) {
			setRemovedSkillIds((prev) =>
				Array.from(new Set([...prev, ...removedSkillIdsForExpertise])),
			);
		}

		setPendingSkills((prev) =>
			prev.filter((skill) => {
				const skillInterestId = skillInterestById.get(skill.skillId);
				return !skillInterestId || nextExpertiseIds.includes(skillInterestId);
			}),
		);

		const selectedSkillId = form.getFieldValue("newSkillId");
		if (selectedSkillId) {
			const skillInterestId = skillInterestById.get(selectedSkillId);
			if (!skillInterestId || !nextExpertiseIds.includes(skillInterestId)) {
				form.setFieldValue("newSkillId", "");
				form.setFieldValue("newSkillLevel", "BEGINNER");
			}
		}

		setSkillError(null);
	};

	if (!profile) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-row items-start justify-between gap-3">
				<div className="space-y-1">
					<h3 className="text-xl font-semibold">Edit Mentor Profile</h3>
					<p className="text-sm text-muted-foreground">
						Update the mentor details shown publicly.
					</p>
				</div>
				<Button type="button" variant="ghost" size="sm" onClick={onCancel}>
					Cancel
				</Button>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<EditMentorProfilePricingAndBioFields
					form={form}
					profile={profile}
					professions={professions}
				/>
				<EditMentorProfileExpertiseSection
					form={form}
					catalogData={catalogData}
					onExpertiseChange={handleExpertiseChange}
				/>
				<form.Subscribe selector={(state) => state.values.areasOfExpertise}>
					{(selectedExpertiseIds) => (
						<EditMentorProfileSkillsSection
							form={form}
							profile={profile}
							catalogData={catalogData}
							pendingSkills={pendingSkills}
							setPendingSkills={setPendingSkills}
							removedSkillIds={removedSkillIds}
							setRemovedSkillIds={setRemovedSkillIds}
							skillError={skillError}
							setSkillError={setSkillError}
							getSkillName={getSkillName}
							selectedExpertiseIds={selectedExpertiseIds}
						/>
					)}
				</form.Subscribe>
				<EditMentorProfileQualificationsSection
					qualificationRows={qualificationRows}
					setQualificationRows={setQualificationRows}
					newQualification={newQualification}
					setNewQualification={setNewQualification}
					qualificationError={qualificationError}
					setQualificationError={setQualificationError}
				/>
				<div className="flex items-center justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={updateMutation.isPending}
					>
						Discard
					</Button>
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<Button
								type="submit"
								disabled={isSubmitting || updateMutation.isPending}
							>
								{(isSubmitting || updateMutation.isPending) && (
									<span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								)}
								Save Changes
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
