import { Coins } from "lucide-react";
import FieldError from "@/components/common/Field-Error";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseNumberInput } from "@/shared/utils/form-validation";
import type { EconomySettingsForm, FieldErrorGetter } from "./EconomySettings";

interface EconomySettingsSubscriptionPlansCardProps {
	form: EconomySettingsForm;
	getFieldErrorMessage: FieldErrorGetter;
}

export function EconomySettingsSubscriptionPlansCard({
	form,
	getFieldErrorMessage,
}: EconomySettingsSubscriptionPlansCardProps) {
	return (
		<Card className="border-border/60 shadow-sm">
			<CardHeader className="bg-muted/30 pt-6">
				<CardTitle className="flex items-center gap-2 text-xl">
					<Coins className="w-5 h-5 text-primary" />
					Subscription Plans
				</CardTitle>
				<CardDescription>
					Configure coin costs for different subscription durations.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-6">
				<form.Field name="subscriptions" mode="array">
					{(field) => (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{field.state.value.map((_, i) => (
								<div
									key={i}
									className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-4"
								>
									<div className="flex items-center justify-between">
										<span className="text-sm font-bold uppercase tracking-wider text-primary">
											{field.state.value[i].type}
										</span>
									</div>
									<form.Field name={`subscriptions[${i}].coinsCost` as any}>
										{(subField) => (
											<div className="space-y-2">
												<Label className="text-xs uppercase font-bold text-muted-foreground">
													Cost in Coins
												</Label>
												<Input
													type="number"
													value={subField.state.value ?? ""}
													onChange={(e) =>
														(subField.handleChange as any)(
															parseNumberInput(e.target.value),
														)
													}
													onBlur={subField.handleBlur}
												/>
												<FieldError
													message={getFieldErrorMessage(
														subField.state.meta.errors,
													)}
												/>
											</div>
										)}
									</form.Field>
								</div>
							))}
						</div>
					)}
				</form.Field>
			</CardContent>
		</Card>
	);
}
