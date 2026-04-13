import { useForm } from "@tanstack/react-form";
import { BookOpen, Save, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import FieldError from "@/components/common/Field-Error";
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
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
	getErrorMessage,
	parseNumberInput,
} from "@/shared/utils/form-validation";
import type { ContentSettingsConfig } from "../types";
import { contentSettingsSchema } from "../validators/platform-settings.schema";

type ContentSettingsFormValues = Omit<
	ContentSettingsConfig,
	"premiumArticleRequirement" | "feed"
> & {
	premiumArticleRequirement: {
		minFreeArticlesNewUserShouldHave: number | "";
		minArticleViews: number | "";
		minLikes: number | "";
	};
	feed: {
		trendingWindowHours: number | "";
		minimumEngagementForTrending: number | "";
		articleDecayRate: number | "";
	};
};

interface ContentSettingsProps {
	settings: ContentSettingsConfig;
	onUpdate: (data: ContentSettingsConfig) => Promise<void>;
	isLoading: boolean;
}

export function ContentSettings({
	settings,
	onUpdate,
	isLoading,
}: ContentSettingsProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [pendingData, setPendingData] = useState<ContentSettingsConfig | null>(
		null,
	);

	const validateForm = (value: ContentSettingsFormValues) => {
		const emptyErrors = buildEmptyStringErrors(value);
		if (Object.keys(emptyErrors).length > 0) {
			return { fields: emptyErrors };
		}

		const parsed = contentSettingsSchema.safeParse(value);
		return parsed.success
			? undefined
			: {
					fields: buildFieldErrorsFromIssues(parsed.error.issues),
				};
	};

	const form = useForm({
		defaultValues: settings as ContentSettingsFormValues,
		validators: {
			onChange: ({ value }) => validateForm(value),
		},
		onSubmit: async ({ value }) => {
			const parsed = contentSettingsSchema.safeParse(value);
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

	const getFieldErrorMessage = (errors: unknown) =>
		getErrorMessage(errors) || String(errors);

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
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Premium Article Requirements */}
					<Card className="border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-muted/30 pb-6 border-b border-border/40">
							<CardTitle className="flex items-center gap-2 text-xl">
								<BookOpen className="w-5 h-5 text-primary" />
								Premium Content
							</CardTitle>
							<CardDescription>
								Configure requirements for articles to be marked as premium.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-8 space-y-6">
							<form.Field name="premiumArticleRequirement.minFreeArticlesNewUserShouldHave">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											Min Free Articles for New Users
										</Label>
										<Input
											type="number"
											value={field.state.value ?? ""}
											onChange={(e) =>
												field.handleChange(parseNumberInput(e.target.value))
											}
											onBlur={field.handleBlur}
											placeholder="e.g. 5"
										/>
										<FieldError
											message={getFieldErrorMessage(field.state.meta.errors)}
										/>
										<p className="text-[11px] text-muted-foreground">
											Minimum number of free articles a user must have published
											before they can create premium ones.
										</p>
									</div>
								)}
							</form.Field>

							<div className="grid grid-cols-2 gap-4">
								<form.Field name="premiumArticleRequirement.minArticleViews">
									{(field) => (
										<div className="space-y-2">
											<Label className="text-sm font-semibold">Min Views</Label>
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
								<form.Field name="premiumArticleRequirement.minLikes">
									{(field) => (
										<div className="space-y-2">
											<Label className="text-sm font-semibold">Min Likes</Label>
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
							</div>
						</CardContent>
					</Card>

					{/* Feed & Trending Settings */}
					<Card className="border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-muted/30 pb-6 border-b border-border/40">
							<CardTitle className="flex items-center gap-2 text-xl">
								<TrendingUp className="w-5 h-5 text-primary" />
								Feed Algorithm
							</CardTitle>
							<CardDescription>
								Adjust how content trends and decays in the platform feed.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-8 space-y-6">
							<form.Field name="feed.trendingWindowHours">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											Trending Window (Hours)
										</Label>
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

							<form.Field name="feed.minimumEngagementForTrending">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											Min Engagement for Trending
										</Label>
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

							<form.Field name="feed.articleDecayRate">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											Decay Rate (Multiplier)
										</Label>
										<Input
											type="number"
											step="0.01"
											value={field.state.value ?? ""}
											onChange={(e) =>
												field.handleChange(parseNumberInput(e.target.value))
											}
											onBlur={field.handleBlur}
										/>
										<FieldError
											message={getFieldErrorMessage(field.state.meta.errors)}
										/>
										<p className="text-[11px] text-muted-foreground italic">
											Lower values mean content stays relevant longer.
										</p>
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
						Update Content Algorithm
					</Button>
				</div>
			</form>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirmUpdate}
				title="Confirm Content Settings Change"
				message="Modifying feed algorithms and content requirements will change how articles are distributed and monetized. Continue?"
				variant="destructive"
				isLoading={isLoading}
				confirmText="Yes, Update Content Settings"
			/>
		</div>
	);
}
