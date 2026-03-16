import { useForm } from "@tanstack/react-form";
import { Coins, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import FieldError from "@/components/common/Field-Error";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/form-validation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EconomySettingsConfig } from "../types";
import { economySettingsSchema } from "../validators/platform-settings.schema";

type EconomySettingsFormValues = Omit<
	EconomySettingsConfig,
	| "purchaseRates"
	| "userJoinRewardCoinCount"
	| "maxCoinsEarnablePerDay"
	| "maxCoinsFromReadingPerDay"
	| "maxCoinsFromEngagementPerDay"
	| "subscriptions"
> & {
	purchaseRates: Array<
		Omit<
			EconomySettingsConfig["purchaseRates"][number],
			"price" | "coinsCount"
		> & {
			price: number | "";
			coinsCount: number | "";
		}
	>;
	subscriptions: Array<
		Omit<EconomySettingsConfig["subscriptions"][number], "coinsCost"> & {
			coinsCost: number | "";
		}
	>;
	userJoinRewardCoinCount: number | "";
	maxCoinsEarnablePerDay: number | "";
	maxCoinsFromReadingPerDay: number | "";
	maxCoinsFromEngagementPerDay: number | "";
};

interface EconomySettingsProps {
	settings: EconomySettingsConfig;
	onUpdate: (data: EconomySettingsConfig) => Promise<void>;
	isLoading: boolean;
}

export function EconomySettings({
	settings,
	onUpdate,
	isLoading,
}: EconomySettingsProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [pendingData, setPendingData] = useState<EconomySettingsConfig | null>(
		null,
	);

	const validateForm = (value: EconomySettingsFormValues) => {
		const emptyErrors = buildEmptyStringErrors(value);
		if (Object.keys(emptyErrors).length > 0) {
			return { fields: emptyErrors };
		}

		const parsed = economySettingsSchema.safeParse(value);
		return parsed.success
			? undefined
			: {
					fields: buildFieldErrorsFromIssues(parsed.error.issues),
				};
	};

	const form = useForm({
		defaultValues: settings as EconomySettingsFormValues,
		validators: {
			onChange: ({ value }) => validateForm(value),
		},
		onSubmit: async ({ value }) => {
			const parsed = economySettingsSchema.safeParse(value);
			if (!parsed.success) return;
			setPendingData(parsed.data);
			setIsConfirmOpen(true);
		},
	});
	const handleConfirmUpdate = async () => {
		if (pendingData) {
			await onUpdate(pendingData);
			setIsConfirmOpen(false);
			setPendingData(null);
		}
	};

	const parseNumberInput = (value: string): number | "" =>
		value === "" ? "" : Number(value);
	const getErrorMessage = (errors: unknown) => {
		if (!errors) return undefined;
		if (Array.isArray(errors)) {
			const first = errors[0] as { message?: string } | undefined;
			return first?.message || first?.toString() || undefined;
		}
		if (typeof errors === "string") return errors;
		if (typeof errors === "object") {
			const message = (errors as { message?: string }).message;
			return message || String(errors);
		}
		return String(errors);
	};

	const getPayoutRateForCoins = (
		coinsCount: number,
		payoutRates: EconomySettingsConfig["payoutRates"],
	) => {
		return (
			payoutRates.find(
				(rate) =>
					coinsCount >= rate.coinsCountFrom && coinsCount <= rate.coinsCountTo,
			) ?? payoutRates.at(-1)
		);
	};

	const calculateRevenuePercentage = (
		price: number | "",
		coinsCount: number | "",
		payoutRates: EconomySettingsConfig["payoutRates"],
	) => {
		if (price === "" || coinsCount === "") return null;
		if (price <= 0 || coinsCount <= 0) return null;
		const payoutRate = getPayoutRateForCoins(coinsCount, payoutRates);
		if (!payoutRate) return null;
		const coinValue = price / coinsCount;
		if (coinValue <= 0) return null;
		const revenuePercentage =
			(1 - payoutRate.payoutPerCoinRate / coinValue) * 100;
		return Math.max(0, Number(revenuePercentage.toFixed(2)));
	};

	return (
		<div className="space-y-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				{/* Purchase Rates */}
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="bg-muted/30 pt-6">
						<CardTitle className="flex items-center gap-2 text-xl">
							<Coins className="w-5 h-5 text-primary" />
							Purchase Rates
						</CardTitle>
						<CardDescription>
							Configure how many coins users get for different price points.
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6 space-y-4">
						<form.Field name="purchaseRates" mode="array">
							{(field) => (
								<div className="space-y-3">
									{field.state.value.map((_, i) => (
										<div
											key={i}
											className="flex items-end gap-4 p-3 rounded-lg border border-border/40 bg-muted/10"
										>
											<form.Field name={`purchaseRates[${i}].price` as any}>
												{(subField) => (
													<div className="flex-1 space-y-2">
														<Label className="text-xs uppercase font-bold text-muted-foreground">
															Price (INR)
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
															message={getErrorMessage(
																subField.state.meta.errors,
															)}
														/>
													</div>
												)}
											</form.Field>
											<form.Field
												name={`purchaseRates[${i}].coinsCount` as any}
											>
												{(subField) => (
													<div className="flex-1 space-y-2">
														<Label className="text-xs uppercase font-bold text-muted-foreground">
															Coins
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
															message={getErrorMessage(
																subField.state.meta.errors,
															)}
														/>
													</div>
												)}
											</form.Field>
											<div className="w-32 space-y-2">
												<Label className="text-xs uppercase font-bold text-muted-foreground">
													Revenue %
												</Label>
												<div className="h-9 px-3 rounded-md border border-border/40 bg-muted/40 flex items-center text-sm font-semibold">
													{calculateRevenuePercentage(
														field.state.value[i].price,
														field.state.value[i].coinsCount,
														form.state.values.payoutRates,
													) ?? "—"}
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:bg-destructive/10"
												type="button"
												onClick={() => {
													const newVal = field.state.value.filter(
														(_, index) => index !== i,
													);
													field.handleChange(newVal);
												}}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="w-full dashed border-2 border-dashed"
										onClick={() => field.pushValue({ price: 0, coinsCount: 0 })}
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Rate
									</Button>
								</div>
							)}
						</form.Field>
					</CardContent>
				</Card>

				{/* Subscriptions */}
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
															message={getErrorMessage(
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

				{/* Global Coin Settings */}
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
											message={getErrorMessage(field.state.meta.errors)}
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
											message={getErrorMessage(field.state.meta.errors)}
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
											message={getErrorMessage(field.state.meta.errors)}
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
											message={getErrorMessage(field.state.meta.errors)}
										/>
									</div>
								)}
							</form.Field>
						</CardContent>
					</Card>
				</div>

				<div className="flex justify-end pt-4">
					<Button
						type="submit"
						size="lg"
						disabled={isLoading}
						className="px-8 shadow-md"
					>
						<Save className="w-4 h-4 mr-2" />
						Update Coin Settings
					</Button>
				</div>
			</form>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirmUpdate}
				title="Confirm Coin Settings Change"
				message="Are you sure you want to update core coin settings? This will immediately affect pricing and rewards for all users."
				variant="destructive"
				isLoading={isLoading}
				confirmText="Yes, Update Settings"
			/>
		</div>
	);
}
