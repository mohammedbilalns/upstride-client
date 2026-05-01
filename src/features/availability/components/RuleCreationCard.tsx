import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CreateRuleForm } from "@/features/availability/components/CreateRuleForm";
import type { AvailabilityFormValues } from "@/features/availability/validators/rule.schema";

interface RuleCreationCardProps {
	defaultValues: AvailabilityFormValues;
	onSubmit: (data: unknown) => void;
	isPending: boolean;
	formKey: number;
	title?: string;
	submitLabel?: string;
	onCancel?: () => void;
}

export function RuleCreationCard({
	defaultValues,
	onSubmit,
	isPending,
	formKey,
	title = "Create New Rule",
	submitLabel,
	onCancel,
}: RuleCreationCardProps) {
	return (
		<Card className="overflow-hidden border-border/60 shadow-sm">
			<CardHeader className="bg-muted/30">
				<CardTitle className="text-lg flex items-center gap-2">
					<Plus className="h-5 w-5 text-primary" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 p-4 sm:p-6">
				<CreateRuleForm
					key={formKey}
					defaultValues={defaultValues}
					onSubmit={onSubmit}
					isPending={isPending}
					submitLabel={submitLabel}
					onCancel={onCancel}
				/>
			</CardContent>
		</Card>
	);
}
