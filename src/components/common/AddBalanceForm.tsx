import { useForm } from "@tanstack/react-form";
import { CreditCard } from "lucide-react";
import { useId } from "react";
import { z } from "zod";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/shared/utils/form-validation";

interface AddBalanceFormProps {
	onSubmit: (coins: number) => Promise<void>;
	label?: string;
	placeholder?: string;
	coinValue?: number;
}

const addBalanceSchema = z.object({
	coins: z.number().positive("Coin amount must be greater than 0"),
});

export function AddBalanceForm({
	onSubmit,
	label = "Add coins to your wallet",
	placeholder = "Enter coin amount",
	coinValue,
}: AddBalanceFormProps) {
	const inputId = useId();
	const form = useForm({
		defaultValues: {
			coins: 0,
		},
		validators: {
			onSubmit: addBalanceSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value.coins);
			form.reset();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="flex flex-col gap-2">
				<label
					htmlFor={inputId}
					className="text-sm font-medium text-muted-foreground"
				>
					{label}
				</label>
				<div className="flex items-start gap-3">
					<div className="flex-1">
						<form.Field name="coins">
							{(field) => (
								<div className="space-y-1">
									<Input
										id={inputId}
										type="number"
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value === "" ? 0 : Number(e.target.value),
											)
										}
										placeholder={placeholder}
										className="h-10"
									/>
									<FieldError
										message={getErrorMessage(field.state.meta.errors?.[0])}
									/>
									<div className="min-h-[40px]">
										{coinValue && (field.state.value || 0) > 0 ? (
											<div className="space-y-0.5 text-xs text-muted-foreground">
												<p>
													Cost:{" "}
													<span className="font-semibold text-foreground">
														₹
														{(
															(field.state.value || 0) / coinValue
														).toLocaleString(undefined, {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})}
													</span>
												</p>
												<p>
													Rate: 1 coin ={" "}
													<span className="font-semibold text-foreground">
														₹
														{(1 / coinValue).toLocaleString(undefined, {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})}
													</span>
												</p>
											</div>
										) : null}
									</div>
								</div>
							)}
						</form.Field>
					</div>
					<form.Subscribe selector={(s) => [s.isSubmitting]}>
						{([isSubmitting]) => (
							<Button
								className="h-10 px-4 flex-shrink-0 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900"
								disabled={isSubmitting}
							>
								<CreditCard className="h-4 w-4 mr-2" />
								{isSubmitting ? "..." : "Add Balance"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</div>
		</form>
	);
}
