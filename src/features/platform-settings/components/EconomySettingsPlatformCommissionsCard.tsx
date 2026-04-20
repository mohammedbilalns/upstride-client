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

interface EconomySettingsPlatformCommissionsCardProps {
	form: EconomySettingsForm;
	getFieldErrorMessage: FieldErrorGetter;
}

export function EconomySettingsPlatformCommissionsCard({
	form,
	getFieldErrorMessage,
}: EconomySettingsPlatformCommissionsCardProps) {
	return (
		<Card className="border-border/60 shadow-sm">
			<CardHeader className="bg-muted/30 pt-6">
				<CardTitle className="flex items-center gap-2 text-xl">
					<Coins className="w-5 h-5 text-primary" />
					Platform Commissions
				</CardTitle>
				<CardDescription>
					Configure the platform commission applied to sessions and
					tips/rewards.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				<form.Field name="platformCommissions.sessionPercentage">
					{(field) => (
						<div className="space-y-2">
							<Label>Session Commission %</Label>
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
				<form.Field name="platformCommissions.userTipRewardPercentage">
					{(field) => (
						<div className="space-y-2">
							<Label>Tip/Reward Commission %</Label>
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
