import type { Dispatch, SetStateAction } from "react";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type QualificationRow = {
	id: string;
	value: string;
};

interface EditMentorProfileQualificationsSectionProps {
	qualificationRows: QualificationRow[];
	setQualificationRows: Dispatch<SetStateAction<QualificationRow[]>>;
	newQualification: string;
	setNewQualification: Dispatch<SetStateAction<string>>;
	qualificationError: string | null;
	setQualificationError: Dispatch<SetStateAction<string | null>>;
}

export function EditMentorProfileQualificationsSection({
	qualificationRows,
	setQualificationRows,
	newQualification,
	setNewQualification,
	qualificationError,
	setQualificationError,
}: EditMentorProfileQualificationsSectionProps) {
	return (
		<div className="space-y-2">
			<Label>Educational Qualifications</Label>
			{qualificationRows.length > 0 && (
				<div className="space-y-2 rounded-2xl border border-border/60 bg-muted/10 p-4">
					<div className="space-y-3">
						{qualificationRows.map((row) => (
							<div key={row.id} className="flex gap-2">
								<Input
									value={row.value}
									onChange={(e) => {
										setQualificationRows((prev) =>
											prev.map((item) =>
												item.id === row.id
													? { ...item, value: e.target.value }
													: item,
											),
										);
									}}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										setQualificationRows((prev) =>
											prev.filter((item) => item.id !== row.id),
										)
									}
								>
									Remove
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
			<div className="flex gap-2">
				<Input
					placeholder="Qualification"
					value={newQualification}
					onChange={(e) => {
						setQualificationError(null);
						setNewQualification(e.target.value);
					}}
				/>
				<Button
					variant="outline"
					type="button"
					onClick={() => {
						const nextValue = newQualification.trim();
						if (!nextValue) {
							setQualificationError("Please enter a qualification");
							return;
						}
						setQualificationRows((prev) => [
							...prev,
							{
								id:
									globalThis.crypto?.randomUUID?.() ??
									`${Date.now()}-${Math.random()}`,
								value: nextValue,
							},
						]);
						setNewQualification("");
						setQualificationError(null);
					}}
				>
					Add
				</Button>
			</div>
			<FieldError message={qualificationError ?? undefined} />
		</div>
	);
}
