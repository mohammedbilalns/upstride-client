import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import FieldError from "@/components/common/Field-Error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { catalogService } from "@/features/catalog-management/services/catalog.service";
import { mentorProfileService } from "@/features/mentor-profile";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-dashboard",
)({
	component: MentorDashboard,
});

function MentorDashboard() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["mentor-profile"],
		queryFn: () => mentorProfileService.getProfile(),
	});
	const { data: catalogData } = useQuery({
		queryKey: ["catalog"],
		queryFn: () => catalogService.fetchCatalog(),
	});

	const profile = data?.data.profile;
	const [isEditOpen, setIsEditOpen] = useState(false);
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
			setIsEditOpen(false);
			setPendingSkills([]);
			setPendingQualifications([]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to update profile");
		},
	});

	const openEdit = () => {
		if (!profile) return;
		form.reset();
		form.setFieldValue(
			"currentPricePer30Min",
			profile.currentPricePer30Min ? String(profile.currentPricePer30Min) : "",
		);
		form.setFieldValue("bio", profile.bio || "");
		form.setFieldValue("newSkillId", "");
		form.setFieldValue("newSkillLevel", "BEGINNER");
		form.setFieldValue("newQualification", "");
		setPendingSkills([]);
		setPendingQualifications([]);
		setSkillError(null);
		setQualificationError(null);
		setIsEditOpen(true);
	};

	const mentorProfileSchema = useMemo(
		() =>
			z.object({
				currentPricePer30Min: z
					.string()
					.refine(
						(value) =>
							value === "" ||
							(!Number.isNaN(Number(value)) &&
								Number.isInteger(Number(value)) &&
								Number(value) >= 100 &&
								Number(value) <= 10000),
						{
							message: "Price must be a whole number between 100 and 10000",
						},
					),
				bio: z.string().trim().min(10, "Bio must be at least 10 characters"),
				newSkillId: z.string(),
				newSkillLevel: z.string(),
				newQualification: z.string(),
			}),
		[],
	);

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

	return (
		<div className="p-8 space-y-6">
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-2xl">Mentor Dashboard</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						Manage your availability and upcoming sessions.
					</p>
					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading profile...</p>
					)}
					{profile && (
						<div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
							<div className="space-y-2">
								<div className="flex items-center gap-3 flex-wrap">
									<h2 className="text-xl font-semibold">{profile.user.name}</h2>
									{profile.tierName && (
										<Badge variant="secondary">{profile.tierName}</Badge>
									)}
									<Button variant="outline" size="sm" onClick={openEdit}>
										Edit Profile
									</Button>
								</div>
								<p className="text-sm text-muted-foreground">
									{profile.currentRole.name} • {profile.organization}
								</p>
								{profile.personalWebsite && (
									<p className="text-sm text-muted-foreground">
										{profile.personalWebsite}
									</p>
								)}
							</div>
							<div className="md:ml-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="p-4 border border-border/60 rounded-lg">
									<p className="text-xs text-muted-foreground">Current Price</p>
									<p className="text-lg font-semibold flex items-center gap-2">
										<Coins className="h-4 w-4 text-primary" />
										<span>{profile.currentPricePer30Min ?? 0}</span>
										<span className="text-sm text-muted-foreground">/ 30m</span>
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Profile Details</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{profile && (
						<div className="p-6 md:p-8 space-y-6">
							<div>
								<p className="text-sm font-medium">Bio</p>
								<p className="text-sm text-muted-foreground">{profile.bio}</p>
							</div>
							<div>
								<p className="text-sm font-medium">Expertises</p>
								<div className="flex flex-wrap gap-2 mt-2">
									{profile.expertises.map((exp) => (
										<Badge key={exp.id} variant="outline">
											{exp.name}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm font-medium">Skills</p>
								<div className="flex flex-wrap gap-2 mt-2">
									{profile.skills.map((skill) => (
										<Badge key={skill.id} variant="secondary">
											{skill.name} • {skill.level}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm font-medium">
									Educational Qualifications
								</p>
								<ul className="list-disc pl-6 text-sm text-muted-foreground mt-2">
									{profile.educationalQualifications.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						</div>
					)}
					{!profile && !isLoading && (
						<p className="text-muted-foreground p-6">No profile data found.</p>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);
					form.reset();
					setSkillError(null);
					setQualificationError(null);
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
														.filter((interest) =>
															profile?.expertises.some(
																(exp) => exp.id === interest.id,
															),
														)
														.flatMap((interest) => interest.skills)
														.filter(
															(skill) =>
																!profile?.skills.some(
																	(existing) => existing.id === skill.id,
																) &&
																!pendingSkills.some(
																	(pending) => pending.skillId === skill.id,
																),
														)
														.map((skill) => (
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
												<SelectItem value="INTERMEDIATE">
													Intermediate
												</SelectItem>
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
														setQualificationError(
															"Please enter a qualification",
														);
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
		</div>
	);
}
