import { Award, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import FieldError from "@/components/common/Field-Error";
import { SkillLevelValues } from "@/shared/types/user";
import type { MentorSkill } from "@/features/mentor-registration/types";

interface ExpertiseSectionProps {
	form: any;
	interests: any[];
	getErrorMessage: (errors: any[]) => string | undefined;
}

export function ExpertiseSection({
	form,
	interests,
	getErrorMessage,
}: ExpertiseSectionProps) {
	return (
		<Card className="overflow-hidden border-none shadow-md ring-1 ring-border/50">
			<CardHeader className="bg-muted/30 pb-4">
				<CardTitle className="text-lg flex items-center gap-2">
					<Award className="h-5 w-5 text-primary" />
					Expertise & Skills
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-6 space-y-8">
				<form.Field name="areasOfExpertise">
					{(field: any) => (
						<div className="space-y-4">
							<Label>Areas of Expertise (Select up to 2)</Label>
							<div className="flex flex-wrap gap-2">
								{interests.map((interest) => {
									const isSelected = field.state.value.includes(interest.id);
									const atMax = field.state.value.length >= 2;
									return (
										<button
											key={interest.id}
											type="button"
											disabled={!isSelected && atMax}
											onClick={() => {
												if (isSelected) {
													field.handleChange(
														field.state.value.filter(
															(id: string) => id !== interest.id,
														),
													);
												} else if (!atMax) {
													field.handleChange([
														...field.state.value,
														interest.id,
													]);
												}
											}}
											className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
												isSelected
													? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
													: atMax
														? "border-border text-muted-foreground opacity-40 cursor-not-allowed"
														: "bg-background text-foreground border-border hover:bg-muted"
											}`}
										>
											{interest.name}
										</button>
									);
								})}
							</div>
							<FieldError message={getErrorMessage(field.state.meta.errors)} />
						</div>
					)}
				</form.Field>

				<form.Subscribe selector={(s: any) => [s.values.areasOfExpertise]}>
					{([selectedExpertiseIds]: [string[]]) => (
						<form.Field name="toolsAndSkills">
							{(field: any) => {
								const allRelevantSkills = interests
									.filter((i) => selectedExpertiseIds.includes(i.id))
									.flatMap((i) => i.skills);

								// Unique skills by ID to avoid duplicate keys and selection issues
								const relevantSkills = Array.from(
									new Map(allRelevantSkills.map((s) => [s.id, s])).values(),
								);

								return (
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<Label>Top Tools & Skills</Label>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="h-8 rounded-full"
												disabled={selectedExpertiseIds.length === 0}
												onClick={() =>
													field.handleChange([
														...field.state.value,
														{ skillId: "", level: "BEGINNER" },
													])
												}
											>
												<Plus className="h-3.5 w-3.5 mr-1" /> Add Skill
											</Button>
										</div>
										{selectedExpertiseIds.length === 0 ? (
											<p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg border border-dashed">
												Please select at least one area of expertise to add
												skills.
											</p>
										) : (
											<div className="space-y-3">
												{field.state.value.map(
													(_: MentorSkill, index: number) => (
														<div
															key={index}
															className="flex flex-col gap-2 p-3 rounded-xl bg-muted/20 border border-border/50"
														>
															<div className="flex gap-3">
																<form.Field
																	name={`toolsAndSkills[${index}].skillId`}
																>
																	{(subField: any) => (
																		<div className="flex-1 space-y-1">
																			<Select
																				value={subField.state.value}
																				onValueChange={(val) =>
																					subField.handleChange(val)
																				}
																			>
																				<SelectTrigger>
																					<SelectValue placeholder="Select a skill" />
																				</SelectTrigger>
																				<SelectContent>
																					{relevantSkills.map((s) => (
																						<SelectItem key={s.id} value={s.id}>
																							{s.name}
																						</SelectItem>
																					))}
																				</SelectContent>
																			</Select>
																			<FieldError
																				message={getErrorMessage(
																					subField.state.meta.errors,
																				)}
																			/>
																		</div>
																	)}
																</form.Field>
																<form.Field
																	name={`toolsAndSkills[${index}].level`}
																>
																	{(subField: any) => (
																		<div className="w-1/3 space-y-1">
																			<Select
																				value={subField.state.value}
																				onValueChange={(val) =>
																					subField.handleChange(val)
																				}
																			>
																				<SelectTrigger>
																					<SelectValue />
																				</SelectTrigger>
																				<SelectContent>
																					{SkillLevelValues.map((level) => (
																						<SelectItem
																							key={level}
																							value={level}
																						>
																							{level.charAt(0) +
																								level.slice(1).toLowerCase()}
																						</SelectItem>
																					))}
																				</SelectContent>
																			</Select>
																			<FieldError
																				message={getErrorMessage(
																					subField.state.meta.errors,
																				)}
																			/>
																		</div>
																	)}
																</form.Field>
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	className="text-muted-foreground hover:text-destructive transition-colors mt-px"
																	onClick={() => {
																		const newValue = [...field.state.value];
																		newValue.splice(index, 1);
																		field.handleChange(newValue);
																	}}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</div>
													),
												)}
											</div>
										)}
										<FieldError
											message={getErrorMessage(field.state.meta.errors)}
										/>
									</div>
								);
							}}
						</form.Field>
					)}
				</form.Subscribe>
			</CardContent>
		</Card>
	);
}
