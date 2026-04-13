import { Coins } from "lucide-react";
import FieldError from "@/components/common/Field-Error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MentorProfileResponse } from "../types";
import type { EditMentorProfileForm } from "./EditMentorProfileModal";

interface EditMentorProfilePricingAndBioFieldsProps {
	form: EditMentorProfileForm;
	profile: MentorProfileResponse["data"]["profile"] | null | undefined;
}

export function EditMentorProfilePricingAndBioFields({
	form,
	profile,
}: EditMentorProfilePricingAndBioFieldsProps) {
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
			<form.Field name="currentPricePer30Min">
				{(field) => (
					<div className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor={field.name}>Current Session Booking Price</Label>
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
							message={
								typeof field.state.meta.errors?.[0] === "string"
									? field.state.meta.errors[0]
									: field.state.meta.errors?.[0]
										? String(field.state.meta.errors[0])
										: undefined
							}
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
							message={
								typeof field.state.meta.errors?.[0] === "string"
									? field.state.meta.errors[0]
									: field.state.meta.errors?.[0]
										? String(field.state.meta.errors[0])
										: undefined
							}
						/>
					</div>
				)}
			</form.Field>
		</>
	);
}
