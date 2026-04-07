import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRuleForm } from "@/features/availability-management/components/CreateRuleForm";
import type { AvailabilityFormValues } from "@/features/availability-management/validators/rule.schema";

interface RuleCreationCardProps {
	defaultValues: AvailabilityFormValues;
	onSubmit: (data: unknown) => void;
	isPending: boolean;
	formKey: number;
}

export function RuleCreationCard({
	defaultValues,
	onSubmit,
	isPending,
	formKey,
}: RuleCreationCardProps) {
	return (
		<Card className="border-border/60 shadow-sm overflow-hidden">
			<CardHeader className="bg-muted/30">
				<CardTitle className="text-lg flex items-center gap-2">
					<Plus className="h-5 w-5 text-primary" />
					Create New Rule
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6 space-y-6">
				<CreateRuleForm
					key={formKey}
					defaultValues={defaultValues}
					onSubmit={onSubmit}
					isPending={isPending}
				/>
			</CardContent>
		</Card>
	);
}
