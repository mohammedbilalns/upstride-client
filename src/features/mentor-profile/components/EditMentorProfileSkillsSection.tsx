import type { Dispatch, SetStateAction } from "react";
import FieldError from "@/components/common/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import type {
	CatalogInterest,
	CatalogSkill,
} from "@/features/onboarding/types";
import type { MentorProfileResponse } from "../types";
import type {
	EditMentorProfileForm,
	PendingSkill,
} from "./EditMentorProfileModal";

interface EditMentorProfileSkillsSectionProps {
	form: EditMentorProfileForm;
	profile: MentorProfileResponse["data"]["profile"] | null | undefined;
	catalogData:
		| {
				data: {
					interests: CatalogInterest[];
				};
		  }
		| null
		| undefined;
	pendingSkills: PendingSkill[];
	setPendingSkills: Dispatch<SetStateAction<PendingSkill[]>>;
	skillError: string | null;
	setSkillError: Dispatch<SetStateAction<string | null>>;
	getSkillName: (skillId: string) => string;
}

export function EditMentorProfileSkillsSection({
	form,
	profile,
	catalogData,
	pendingSkills,
	setPendingSkills,
	skillError,
	setSkillError,
	getSkillName,
}: EditMentorProfileSkillsSectionProps) {
	return (
		<div className="space-y-2">
			<Label>Add Skill</Label>
			<div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2">
				<form.Field name="newSkillId">
					{(field) => (
						<div>
							<Select
								value={field.state.value}
								onValueChange={(value) => {
									setSkillError(null);
									field.handleChange(value);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select skill" />
								</SelectTrigger>
								<SelectContent>
									{catalogData?.data.interests
										.filter((interest: CatalogInterest) =>
											profile?.expertises.some((exp) => exp.id === interest.id),
										)
										.flatMap((interest: CatalogInterest) => interest.skills)
										.filter(
											(skill: CatalogSkill) =>
												!profile?.skills.some(
													(existing) => existing.id === skill.id,
												) &&
												!pendingSkills.some(
													(pending) => pending.skillId === skill.id,
												),
										)
										.map((skill: CatalogSkill) => (
											<SelectItem key={skill.id} value={skill.id}>
												{skill.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
							<FieldError message={skillError ?? undefined} />
						</div>
					)}
				</form.Field>
				<form.Field name="newSkillLevel">
					{(field) => (
						<Select
							value={field.state.value}
							onValueChange={(value) =>
								field.handleChange(
									value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="BEGINNER">Beginner</SelectItem>
								<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
								<SelectItem value="ADVANCED">Advanced</SelectItem>
							</SelectContent>
						</Select>
					)}
				</form.Field>
				<Button
					variant="outline"
					type="button"
					onClick={() => {
						const newSkillId = form.getFieldValue("newSkillId");
						const newSkillLevel = form.getFieldValue("newSkillLevel");
						if (!newSkillId) {
							setSkillError("Please select a skill");
							return;
						}
						setPendingSkills((prev) => [
							...prev,
							{
								skillId: newSkillId,
								level: newSkillLevel as
									| "BEGINNER"
									| "INTERMEDIATE"
									| "ADVANCED",
							},
						]);
						form.setFieldValue("newSkillId", "");
						setSkillError(null);
					}}
				>
					Add
				</Button>
			</div>
			{pendingSkills.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{pendingSkills.map((skill, index) => (
						<Badge key={`${skill.skillId}-${index}`} variant="outline">
							{getSkillName(skill.skillId)} • {skill.level}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
}
