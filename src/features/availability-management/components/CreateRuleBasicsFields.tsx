import FieldError from "@/components/common/Field-Error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AvailabilityFormApi } from "./CreateRuleForm";

interface CreateRuleBasicsFieldsProps {
	form: AvailabilityFormApi;
}

export function CreateRuleBasicsFields({ form }: CreateRuleBasicsFieldsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<form.Field name="name">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Rule Name</Label>
						<Input
							id={field.name}
							placeholder="Enter a name for this rule"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
						/>
						<FieldError message={field.state.meta.errors?.[0] as any} />
					</div>
				)}
			</form.Field>
			<form.Field name="description">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Description</Label>
						<Input
							id={field.name}
							placeholder="What is this rule for?"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
						/>
						<FieldError message={field.state.meta.errors?.[0] as any} />
					</div>
				)}
			</form.Field>
		</div>
	);
}
