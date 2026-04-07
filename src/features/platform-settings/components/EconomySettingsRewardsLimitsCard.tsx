import FieldError from "@/components/common/Field-Error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseNumberInput } from "@/shared/utils/form-validation";
import type { EconomySettingsForm, FieldErrorGetter } from "./EconomySettings";

interface EconomySettingsRewardsLimitsCardProps {
	form: EconomySettingsForm;
	getFieldErrorMessage: FieldErrorGetter;
}

export function EconomySettingsRewardsLimitsCard({
	form,
	getFieldErrorMessage,
}: EconomySettingsRewardsLimitsCardProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Rewards & Limits</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<form.Field name="userJoinRewardCoinCount">
						{(field) => (
							<div className="space-y-2">
								<Label>Join Reward Coins</Label>
								<Input
									type="number"
									value={field.state.value ?? ""}
									onChange={(e) =>
										(field.handleChange as any)(
											parseNumberInput(e.target.value),
										)
									}
									onBlur={field.handleBlur}
								/>
								<FieldError
									message={getFieldErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="maxCoinsEarnablePerDay">
						{(field) => (
							<div className="space-y-2">
								<Label>Max Daily Earnings</Label>
								<Input
									type="number"
									value={field.state.value ?? ""}
									onChange={(e) =>
										(field.handleChange as any)(
											parseNumberInput(e.target.value),
										)
									}
									onBlur={field.handleBlur}
								/>
								<FieldError
									message={getFieldErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="maxCoinsFromReadingPerDay">
						{(field) => (
							<div className="space-y-2">
								<Label>Max Reading Coins/Day</Label>
								<Input
									type="number"
									value={field.state.value ?? ""}
									onChange={(e) =>
										(field.handleChange as any)(
											parseNumberInput(e.target.value),
										)
									}
									onBlur={field.handleBlur}
								/>
								<FieldError
									message={getFieldErrorMessage(field.state.meta.errors)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="maxCoinsFromEngagementPerDay">
						{(field) => (
							<div className="space-y-2">
								<Label>Max Engagement Coins/Day</Label>
								<Input
									type="number"
									value={field.state.value ?? ""}
									onChange={(e) =>
										(field.handleChange as any)(
											parseNumberInput(e.target.value),
										)
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
		</div>
	);
}
