import { Coins } from "lucide-react";
import FieldError from "@/components/common/FieldError";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { parseNumberInput } from "@/shared/utils/formValidation";
import type { EconomySettingsForm, FieldErrorGetter } from "./EconomySettings";

interface EconomySettingsCoinValueCardProps {
	form: EconomySettingsForm;
	getFieldErrorMessage: FieldErrorGetter;
}

export function EconomySettingsCoinValueCard({
	form,
	getFieldErrorMessage,
}: EconomySettingsCoinValueCardProps) {
	return (
		<Card className="border-border/60 shadow-sm">
			<CardHeader className="bg-muted/30 pt-6">
				<CardTitle className="flex items-center gap-2 text-xl">
					<Coins className="w-5 h-5 text-primary" />
					Coin Value
				</CardTitle>
				<CardDescription>
					Define how many coins equal 1 INR for both purchase and withdrawals.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-6">
				<form.Field name="coinValue">
					{(field) => (
						<div className="space-y-2">
							<Label>Coins per INR</Label>
							<Input
								type="number"
								value={field.state.value ?? ""}
								onChange={(e) =>
									field.handleChange(parseNumberInput(e.target.value))
								}
								onBlur={field.handleBlur}
							/>
							<FieldError
								message={getFieldErrorMessage(field.state.meta.errors)}
							/>
						</div>
					)}
				</form.Field>
			</CardContent>
		</Card>
	);
}
