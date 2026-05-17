import { Coins } from "lucide-react";
import { useState } from "react";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useProfessions } from "@/features/mentor-registration/hooks/queries/useCatalog";
import type { Profession } from "@/features/mentor-registration/services/catalog.service";
import {
	MentorLanguageCodes,
	MentorLanguageMap,
} from "@/shared/constants/language.constants";
import { getErrorMessage } from "@/shared/utils/formValidation";
import type { MentorProfileResponse } from "../types";
import type { EditMentorProfileForm } from "./EditMentorProfileEditor";

interface EditMentorProfilePricingAndBioFieldsProps {
	form: EditMentorProfileForm;
	profile: MentorProfileResponse["profile"] | null | undefined;
	professions?: Profession[] | undefined;
}

export function EditMentorProfilePricingAndBioFields({
	form,
	profile,
	professions: professionsProp,
}: EditMentorProfilePricingAndBioFieldsProps) {
	const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
	const { data: professionsData } = useProfessions();
	const professions = professionsProp ?? professionsData;

	return (
		<>
			{profile?.mentorSessionEarningPercentage !== undefined && (
				<p className="text-sm text-muted-foreground">
					You receive{" "}
					<span className="font-semibold text-foreground">
						{profile.mentorSessionEarningPercentage}%
					</span>{" "}
					of each session booking.
				</p>
			)}
			<form.Field name="currentRoleId">
				{(field) => {
					const selectedProfession = professions?.find(
						(prof) => prof.id === field.state.value,
					);

					return (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Current Role</Label>
							<Button
								type="button"
								variant="outline"
								className="w-full justify-between rounded-xl"
								onClick={() => setIsRoleMenuOpen((open) => !open)}
							>
								<span>{selectedProfession?.name ?? "Select current role"}</span>
								<span className="text-muted-foreground">⌄</span>
							</Button>
							{isRoleMenuOpen && (
								<div className="rounded-xl border border-border/60 bg-background p-2 shadow-xl">
									<div className="max-h-56 overflow-y-auto space-y-1">
										{professions?.length ? (
											professions.map((prof) => (
												<button
													key={prof.id}
													type="button"
													className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
													onClick={() => {
														field.handleChange(prof.id);
														setIsRoleMenuOpen(false);
													}}
												>
													{prof.name}
												</button>
											))
										) : (
											<div className="px-3 py-2 text-sm text-muted-foreground">
												No roles available
											</div>
										)}
									</div>
									<div className="mt-2 flex justify-end">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setIsRoleMenuOpen(false)}
										>
											Close
										</Button>
									</div>
								</div>
							)}
							<FieldError
								message={getErrorMessage(field.state.meta.errors?.[0])}
							/>
						</div>
					);
				}}
			</form.Field>
			<form.Field name="organization">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Company / Organization</Label>
						<Input
							id={field.name}
							placeholder="e.g. Google"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
						/>
						<FieldError
							message={getErrorMessage(field.state.meta.errors?.[0])}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="languages">
				{(field) => (
					<div className="space-y-2">
						<Label>Languages</Label>
						<div className="flex flex-wrap gap-2">
							{MentorLanguageCodes.map((languageCode) => {
								const selected = field.state.value.includes(languageCode);
								return (
									<button
										key={languageCode}
										type="button"
										className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
											selected
												? "border-primary bg-primary text-primary-foreground"
												: "border-border bg-background text-foreground hover:border-primary/40"
										}`}
										onClick={() =>
											field.handleChange(
												selected
													? field.state.value.filter(
															(value) => value !== languageCode,
														)
													: [...field.state.value, languageCode],
											)
										}
									>
										{MentorLanguageMap[languageCode]}
									</button>
								);
							})}
						</div>
						<FieldError
							message={getErrorMessage(field.state.meta.errors?.[0])}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="currentPricePer30Min">
				{(field) => (
					<div className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor={field.name}>
								Current Session Rate Per 30 minutes
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
						<FieldError
							message={getErrorMessage(field.state.meta.errors?.[0])}
						/>
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
						<FieldError
							message={getErrorMessage(field.state.meta.errors?.[0])}
						/>
					</div>
				)}
			</form.Field>
		</>
	);
}
