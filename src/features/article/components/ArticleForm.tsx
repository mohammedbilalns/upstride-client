import { useForm } from "@tanstack/react-form";
import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
	type ArticleFormValues,
	articleSchema,
} from "@/features/article/validators/article-form.schema";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { ArticleEditor } from "./ArticleEditor";
import { ArticleImageUpload } from "./ArticleImageUpload";

interface ArticleFormProps {
	defaultValues: {
		title: string;
		content: string;
		featuredImageUrl: string;
		tags: string[] | undefined;
	};
	onSubmit: (values: ArticleFormValues) => void;
	submitText: string;
	submittingText: string;
	isPending: boolean;
	previewUrl?: string;
}

export function ArticleForm({
	defaultValues,
	onSubmit,
	submitText,
	submittingText,
	isPending,
	previewUrl,
}: ArticleFormProps) {
	const form = useForm({
		defaultValues,
		validators: {
			//FIX: type error
			onSubmit: articleSchema,
		},
		onSubmit: async ({ value }) => {
			const result = articleSchema.safeParse(value);
			if (!result.success) return;
			onSubmit(result.data);
		},
	});
	const [hasSubmitted, setHasSubmitted] = useState(false);

	useEffect(() => {
		if (defaultValues.title || defaultValues.content) {
			form.setFieldValue("title", defaultValues.title);
			form.setFieldValue("content", defaultValues.content);
			form.setFieldValue("featuredImageUrl", defaultValues.featuredImageUrl);
			form.setFieldValue("tags", defaultValues.tags);
		}
	}, [
		defaultValues.title,
		defaultValues.content,
		defaultValues.featuredImageUrl,
		defaultValues.tags,
		form,
	]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setHasSubmitted(true);
				form.handleSubmit();
			}}
			className="pb-20"
		>
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1 space-y-6 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50">
					<form.Field name="title">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									placeholder="Enter a catchy title (min 20 chars)"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="h-12 text-lg font-semibold rounded-xl"
								/>
								{field.state.meta.errors &&
								field.state.meta.errors.length > 0 &&
								hasSubmitted ? (
									<p className="text-sm text-red-500/90 dark:text-red-400 mt-1">
										{getErrorMessage(field.state.meta.errors?.[0]) ||
											"Invalid input"}
									</p>
								) : null}
							</div>
						)}
					</form.Field>

					<form.Field name="content">
						{(field) => (
							<div className="space-y-2">
								<Label>Article Content</Label>
								<ArticleEditor
									content={field.state.value}
									onChange={(content) => field.handleChange(content)}
									onBlur={field.handleBlur}
								/>
								{field.state.meta.errors &&
								field.state.meta.errors.length > 0 &&
								hasSubmitted ? (
									<p className="text-sm text-red-500/90 dark:text-red-400 mt-1">
										{getErrorMessage(field.state.meta.errors?.[0]) ||
											"Invalid input"}
									</p>
								) : null}
							</div>
						)}
					</form.Field>
				</div>

				<div className="w-full lg:w-90 space-y-6">
					<div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 space-y-6">
						<form.Field name="featuredImageUrl">
							{(field) => (
								<div className="space-y-2">
									<Label>Featured Image</Label>
									<ArticleImageUpload
										value={field.state.value}
										previewUrl={previewUrl}
										onChange={(url) => field.handleChange(url)}
										onRemove={() => field.handleChange("")}
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 &&
									hasSubmitted ? (
										<p className="text-sm text-red-500/90 dark:text-red-400 mt-1">
											{getErrorMessage(field.state.meta.errors?.[0]) ||
												"Invalid input"}
										</p>
									) : null}
								</div>
							)}
						</form.Field>

						<form.Field name="tags">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor="tags">Tags</Label>
									<div className="flex flex-wrap gap-2 mb-2">
										{field.state.value?.map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="pl-2 pr-1 py-0.5 flex items-center gap-1 bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30"
											>
												{tag}
												<button
													type="button"
													onClick={() =>
														field.handleChange(
															field.state.value?.filter((t) => t !== tag) || [],
														)
													}
													className="hover:bg-primary/20 dark:hover:bg-primary/30 rounded-full p-0.5"
												>
													<Plus className="h-3 w-3 rotate-45" />
												</button>
											</Badge>
										))}
									</div>
									<Input
										id="tags"
										placeholder="Add a tag and press Enter"
										onBlur={field.handleBlur}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												const value = e.currentTarget.value.trim();
												const currentTags = field.state.value || [];
												const isDuplicate = currentTags.some(
													(t) => t.toLowerCase() === value.toLowerCase(),
												);

												if (value && !isDuplicate && currentTags.length < 6) {
													field.handleChange([...currentTags, value]);
													e.currentTarget.value = "";
												} else if (isDuplicate || currentTags.length >= 6) {
													e.currentTarget.value = "";
												}
											}
										}}
										className="h-11 rounded-xl"
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 &&
									hasSubmitted ? (
										<p className="text-sm text-red-500/90 dark:text-red-400 mt-1">
											{getErrorMessage(field.state.meta.errors?.[0]) ||
												"Invalid input"}
										</p>
									) : (
										<p className="text-xs text-zinc-500">
											Press Enter to add tags (Max 6).
										</p>
									)}
								</div>
							)}
						</form.Field>
					</div>
				</div>
			</div>

			<div className="fixed bottom-8 right-8 z-50">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button
							type="submit"
							size="lg"
							disabled={!canSubmit || isSubmitting || isPending}
							className="rounded-full px-8 h-14 bg-primary text-primary-foreground shadow-2xl shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
						>
							{isSubmitting || isPending ? (
								<Loader2 className="h-5 w-5 mr-2 animate-spin" />
							) : (
								<Save className="h-5 w-5 mr-2" />
							)}
							{isSubmitting || isPending ? submittingText : submitText}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
