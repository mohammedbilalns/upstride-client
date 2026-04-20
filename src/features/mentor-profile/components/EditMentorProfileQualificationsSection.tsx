import type { Dispatch, SetStateAction } from "react";
import FieldError from "@/components/common/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { EditMentorProfileForm } from "./EditMentorProfileModal";

interface EditMentorProfileQualificationsSectionProps {
	form: EditMentorProfileForm;
	pendingQualifications: string[];
	setPendingQualifications: Dispatch<SetStateAction<string[]>>;
	qualificationError: string | null;
	setQualificationError: Dispatch<SetStateAction<string | null>>;
}

export function EditMentorProfileQualificationsSection({
	form,
	pendingQualifications,
	setPendingQualifications,
	qualificationError,
	setQualificationError,
}: EditMentorProfileQualificationsSectionProps) {
	return (
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
									setPendingQualifications((prev) => [...prev, nextValue]);
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
					{pendingQualifications.map((item) => (
						<Badge key={item} variant="secondary">
							{item}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
}
