import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mentorProfileService } from "@/features/mentor-profile";
import { mentorProfileSchema } from "@/features/mentor-profile/validators/mentor-profile.schema";

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
	const [pendingSkills, setPendingSkills] = useState<
		{ skillId: string; level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" }[]
	>([]);
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
		onError: (error: any) => {
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
					{profile?.mentorSessionEarningPercentage !== undefined && (
						<p className="text-sm text-muted-foreground">
							You receive{" "}
							<span className="font-semibold text-foreground">
								{profile.mentorSessionEarningPercentage}%
							</span>{" "}
							of each session booking.
						</p>
					)}
					<form.Field name="currentPricePer30Min">
						{(field) => (
							<div className="space-y-2">
								<div className="space-y-1">
									<Label htmlFor={field.name}>
										Current Session Booking Price
									</Label>
									<p className="text-xs text-muted-foreground flex items-center gap-1">
										<Coins className="h-3.5 w-3.5 text-primary" />
										<span>
											Max allowed: {profile?.tierMax30minPayment ?? 0} / 30m
										</span>
									</p>
								</div>
								<Input
									id={field.name}
									type="number"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldError message={field.state.meta.errors?.[0] as any} />
							</div>
						)}
					</form.Field>
					<form.Field name="bio">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Bio</Label>
								<Textarea
									id={field.name}
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldError message={field.state.meta.errors?.[0] as any} />
							</div>
						)}
					</form.Field>
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
													.filter((interest: any) =>
														profile?.expertises.some(
															(exp: any) => exp.id === interest.id,
														),
													)
													.flatMap((interest: any) => interest.skills)
													.filter(
														(skill: any) =>
															!profile?.skills.some(
																(existing: any) => existing.id === skill.id,
															) &&
															!pendingSkills.some(
																(pending) => pending.skillId === skill.id,
															),
													)
													.map((skill: any) => (
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
					<div className="space-y-2">
						<Label>Add Educational Qualification</Label>
						<form.Field name="newQualification">
							{(field) => (
								<>
									<div className="flex gap-2">
										<Input
											placeholder="Qualification"
											value={field.state.value}
											onChange={(e) => {
												setQualificationError(null);
												field.handleChange(e.target.value);
											}}
										/>
										<Button
											variant="outline"
											type="button"
											onClick={() => {
												const nextValue = field.state.value.trim();
												if (!nextValue) {
													setQualificationError("Please enter a qualification");
													return;
												}
												setPendingQualifications((prev) => [
													...prev,
													nextValue,
												]);
												field.handleChange("");
												setQualificationError(null);
											}}
										>
											Add
										</Button>
									</div>
									<FieldError message={qualificationError ?? undefined} />
								</>
							)}
						</form.Field>
						{pendingQualifications.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{pendingQualifications.map((item, index) => (
									<Badge key={`${item}-${index}`} variant="secondary">
										{item}
									</Badge>
								))}
							</div>
						)}
					</div>
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
