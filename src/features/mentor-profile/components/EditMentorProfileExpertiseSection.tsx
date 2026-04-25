import { useState } from "react";
import FieldError from "@/components/common/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { CatalogInterest } from "@/features/onboarding/types";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { MAX_MENTOR_AREAS_OF_EXPERTISE } from "../validators/mentor-profile.schema";
import type { EditMentorProfileForm } from "./EditMentorProfileEditor";

interface EditMentorProfileExpertiseSectionProps {
	form: EditMentorProfileForm;
	catalogData:
		| {
				data: {
					interests: CatalogInterest[];
				};
		  }
		| null
		| undefined;
	onExpertiseChange: (nextExpertiseIds: string[]) => void;
}

export function EditMentorProfileExpertiseSection({
	form,
	catalogData,
	onExpertiseChange,
}: EditMentorProfileExpertiseSectionProps) {
	const [isInterestMenuOpen, setIsInterestMenuOpen] = useState(false);
	const catalog = catalogData?.data.interests ?? [];

	return (
		<form.Field name="areasOfExpertise">
			{(field: any) => {
				const selectedInterestIds = field.state.value as string[];
				const availableInterests = catalog.filter(
					(interest) => !selectedInterestIds.includes(interest.id),
				);

				return (
					<div className="space-y-3 rounded-2xl border border-border/60 bg-muted/5 p-4">
						<div className="space-y-1">
							<p className="text-sm font-semibold">Areas of Interest</p>
							<p className="text-xs text-muted-foreground">
								Select up to {MAX_MENTOR_AREAS_OF_EXPERTISE} areas so your
								public profile stays focused.
							</p>
						</div>

						{selectedInterestIds.length === 0 ? (
							<div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
								Add areas of interest from the dropdown below.
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{selectedInterestIds.map((interestId) => {
									const interest = catalog.find(
										(item) => item.id === interestId,
									);
									if (!interest) return null;

									return (
										<Badge
											key={interest.id}
											variant="secondary"
											className="gap-2"
										>
											<span>{interest.name}</span>
											<button
												type="button"
												className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-destructive"
												onClick={() => {
													const nextInterestIds = selectedInterestIds.filter(
														(id: string) => id !== interest.id,
													);
													field.handleChange(nextInterestIds);
													onExpertiseChange(nextInterestIds);
												}}
												aria-label={`Remove ${interest.name}`}
											>
												×
											</button>
										</Badge>
									);
								})}
							</div>
						)}

						<div className="space-y-3">
							<Button
								type="button"
								variant="outline"
								className="w-full justify-between rounded-xl"
								onClick={() => setIsInterestMenuOpen((open) => !open)}
								disabled={
									availableInterests.length === 0 ||
									selectedInterestIds.length >= MAX_MENTOR_AREAS_OF_EXPERTISE
								}
							>
								<span>Select a new area of interest</span>
								<span className="text-muted-foreground">⌄</span>
							</Button>

							{isInterestMenuOpen && (
								<div className="rounded-xl border border-border/60 bg-background p-2 shadow-xl">
									<div className="max-h-56 overflow-y-auto space-y-1">
										{availableInterests.length === 0 ? (
											<div className="px-3 py-2 text-sm text-muted-foreground">
												No areas left to add
											</div>
										) : (
											availableInterests.map((interest) => (
												<button
													key={interest.id}
													type="button"
													className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
													onClick={() => {
														const nextInterestIds = [
															...selectedInterestIds,
															interest.id,
														];
														field.handleChange(nextInterestIds);
														onExpertiseChange(nextInterestIds);
														setIsInterestMenuOpen(false);
													}}
												>
													{interest.name}
												</button>
											))
										)}
									</div>
									<div className="mt-2 flex justify-end">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setIsInterestMenuOpen(false)}
										>
											Close
										</Button>
									</div>
								</div>
							)}
						</div>

						<FieldError
							message={getErrorMessage(field.state.meta.errors?.[0])}
						/>
					</div>
				);
			}}
		</form.Field>
	);
}
