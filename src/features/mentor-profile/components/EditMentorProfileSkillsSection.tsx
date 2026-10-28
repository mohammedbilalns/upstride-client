import { ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import FieldError from "@/components/common/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import type {
	CatalogInterest,
	CatalogSkill,
} from "@/features/onboarding/types";
import type { MentorProfileResponse } from "../types";
import type {
	EditMentorProfileForm,
	PendingSkill,
} from "./EditMentorProfileEditor";

interface EditMentorProfileSkillsSectionProps {
	form: EditMentorProfileForm;
	profile: MentorProfileResponse["profile"] | null | undefined;
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
	removedSkillIds: string[];
	setRemovedSkillIds: Dispatch<SetStateAction<string[]>>;
	skillError: string | null;
	setSkillError: Dispatch<SetStateAction<string | null>>;
	getSkillName: (skillId: string) => string;
	selectedExpertiseIds: string[];
}

export function EditMentorProfileSkillsSection({
	form,
	profile,
	catalogData,
	pendingSkills,
	setPendingSkills,
	removedSkillIds,
	setRemovedSkillIds,
	skillError,
	setSkillError,
	getSkillName,
	selectedExpertiseIds,
}: EditMentorProfileSkillsSectionProps) {
	const [isSkillMenuOpen, setIsSkillMenuOpen] = useState(false);
	const existingSkills = profile?.skills ?? [];
	const visibleExistingSkills = existingSkills.filter(
		(skill) => !removedSkillIds.includes(skill.id),
	);
	const availableSkills =
		catalogData?.data.interests.flatMap((interest: CatalogInterest) =>
			selectedExpertiseIds.includes(interest.id)
				? interest.skills.map((skill: CatalogSkill) => ({
						interestName: interest.name,
						skill,
					}))
				: [],
		) ?? [];
	const availableSkillIds = new Set([
		...(profile?.skills
			.filter((skill) => !removedSkillIds.includes(skill.id))
			.map((skill) => skill.id) ?? []),
		...(pendingSkills.map((skill) => skill.skillId) ?? []),
	]);
	const selectableSkills = availableSkills.filter(
		({ skill }) => !availableSkillIds.has(skill.id),
	);
	const hasAnySkills =
		visibleExistingSkills.length > 0 || pendingSkills.length > 0;

	return (
		<div className="space-y-2">
			{hasAnySkills && (
				<div className="space-y-2">
					<Label>Current Skills & Proficiency</Label>
					<div className="flex flex-wrap gap-2">
						{visibleExistingSkills.map((skill) => (
							<Badge key={skill.id} variant="secondary" className="gap-2 pr-2">
								<span>
									{skill.name} • {skill.level}
								</span>
								<button
									type="button"
									className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-destructive"
									onClick={() =>
										setRemovedSkillIds((prev) => [...prev, skill.id])
									}
									aria-label={`Remove ${skill.name}`}
								>
									×
								</button>
							</Badge>
						))}
						{pendingSkills.map((skill, index) => (
							<Badge
								key={`${skill.skillId}-${index}`}
								variant="outline"
								className="gap-2 pr-2"
							>
								<span>
									{getSkillName(skill.skillId)} • {skill.level}
								</span>
								<button
									type="button"
									className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-destructive"
									onClick={() =>
										setPendingSkills((prev) =>
											prev.filter((_, currentIndex) => currentIndex !== index),
										)
									}
									aria-label={`Remove ${getSkillName(skill.skillId)}`}
								>
									×
								</button>
							</Badge>
						))}
					</div>
				</div>
			)}

			<Label>Add Skill & Proficiency </Label>
			<div className="space-y-3">
				<form.Field name="newSkillId">
					{(field) => (
						<div className="space-y-2">
							<Button
								type="button"
								variant="outline"
								className="w-full justify-between"
								onClick={() => setIsSkillMenuOpen((open) => !open)}
								disabled={
									selectableSkills.length === 0 ||
									selectedExpertiseIds.length === 0
								}
							>
								<span>
									{field.state.value
										? getSkillName(field.state.value)
										: "Select skill"}
								</span>
								<ChevronDown className="h-4 w-4 text-muted-foreground" />
							</Button>
							{isSkillMenuOpen && (
								<div className="rounded-xl border border-border/60 bg-background p-2 shadow-xl">
									<div className="max-h-56 overflow-y-auto space-y-1">
										{selectedExpertiseIds.length === 0 ? (
											<div className="px-2 py-1.5 text-sm text-muted-foreground">
												Add at least one area of interest first
											</div>
										) : selectableSkills.length === 0 ? (
											<div className="px-2 py-1.5 text-sm text-muted-foreground">
												No skills left to add
											</div>
										) : (
											selectableSkills.map(({ interestName, skill }) => {
												return (
													<button
														key={skill.id}
														type="button"
														onClick={() => {
															setSkillError(null);
															field.handleChange(skill.id);
															setIsSkillMenuOpen(false);
														}}
														className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
													>
														{skill.name}
														<span className="text-xs text-muted-foreground">
															{" "}
															- {interestName}
														</span>
													</button>
												);
											})
										)}
									</div>
									<div className="mt-2 flex justify-end">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setIsSkillMenuOpen(false)}
										>
											Close
										</Button>
									</div>
								</div>
							)}
							<FieldError message={skillError ?? undefined} />
							{field.state.value && (
								<div className="space-y-3 rounded-xl border border-border/60 bg-muted/5 p-3">
									<div className="space-y-1">
										<p className="text-sm font-medium">Select level</p>
										<p className="text-xs text-muted-foreground">
											Choose the proficiency for the selected skill before
											adding it.
										</p>
									</div>
									<form.Field name="newSkillLevel">
										{(levelField) => (
											<div className="flex flex-wrap gap-2">
												{(
													[
														["BEGINNER", "Beginner"],
														["INTERMEDIATE", "Intermediate"],
														["ADVANCED", "Advanced"],
													] as const
												).map(([value, label]) => {
													const isActive = levelField.state.value === value;
													return (
														<button
															key={value}
															type="button"
															onClick={() => levelField.handleChange(value)}
															className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
																isActive
																	? "border-primary bg-primary text-primary-foreground"
																	: "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground"
															}`}
														>
															{label}
														</button>
													);
												})}
											</div>
										)}
									</form.Field>
									<div className="flex items-center justify-end">
										<Button
											variant="outline"
											type="button"
											onClick={() => {
												const newSkillId = form.getFieldValue("newSkillId");
												const newSkillLevel =
													form.getFieldValue("newSkillLevel");
												if (!newSkillId) {
													setSkillError("Please select a skill");
													return;
												}
												setPendingSkills((prev) => [
													...prev,
													{
														skillId: newSkillId as string,
														level: newSkillLevel as
															| "BEGINNER"
															| "INTERMEDIATE"
															| "ADVANCED",
													},
												]);
												form.setFieldValue("newSkillId", "");
												setSkillError(null);
												setIsSkillMenuOpen(false);
											}}
										>
											Add
										</Button>
									</div>
								</div>
							)}
						</div>
					)}
				</form.Field>
			</div>
		</div>
	);
}
