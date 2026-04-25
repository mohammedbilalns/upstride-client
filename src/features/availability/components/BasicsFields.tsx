import FieldError from "@/components/common/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getErrorMessage } from "@/shared/utils/formValidation";
import type { AvailabilityFormApi } from "./CreateRuleForm";

interface CreateRuleBasicsFieldsProps {
	form: AvailabilityFormApi;
}

export function CreateRuleBasicsFields({ form }: CreateRuleBasicsFieldsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<form.Field name="name">
				{/* FIX: Type error */}
				{(field) => (
					<div className="flex flex-col gap-2">
						<Label htmlFor={field.name}>Rule Name</Label>
						<Input
							id={field.name}
							placeholder="Enter a name for this rule"
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
			<form.Field name="description">
				{/* FIX: Type error */}
				{(field) => (
					<div className="flex flex-col gap-2">
						<Label htmlFor={field.name}>Description</Label>
						<Input
							id={field.name}
							placeholder="What is this rule for?"
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
		</div>
	);
}
