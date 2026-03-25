import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArticleEditor } from "../components/ArticleEditor";
import { articleService } from "../services/article.service";
import { ChevronLeft, Plus, Save, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { articleQueries } from "../hooks/queries";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Route } from "@/routes/_user-layout/mentor/articles/$articleId/update";
import { ArticleImageUpload } from "../components/ArticleImageUpload";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const articleSchema = z.object({
	title: z
		.string()
		.trim()
		.min(20, "Title must be at least 20 characters")
		.max(200, "Title is too long"),
	content: z
		.string()
		.trim()
		.min(200, "Content must be at least 200 characters")
		.max(50000, "Content is too long"),
	featuredImageUrl: z.string().optional().or(z.literal("")),
	tags: z
		.array(z.string().trim().min(1))
		.max(6, "Maximum 6 tags allowed")
		.optional(),
});

export function UpdateArticlePage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const { articleId } = Route.useParams();
	const { data } = useQuery(articleQueries.detail(articleId));

	const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

	const updateMutation = useMutation({
		mutationFn: articleService.updateArticle,
		onSuccess: () => {
			toast.success("Article updated successfully");
			queryClient.invalidateQueries({ queryKey: articleQueries.all });
			navigate({ to: "/articles/$articleId", params: { articleId } });
		},
		onError: (error) => {
			toast.error("Failed to update article");
			console.error(error);
		},
	});

	const form = useForm({
		defaultValues: {
			title: "",
			content: "",
			featuredImageUrl: "",
			tags: [] as string[] | undefined,
		},
		validators: {
			onChange: articleSchema as any,
		},
		onSubmit: async () => {
			// Trigger modal on formal submit
			setShowUpdateConfirm(true);
		},
	});

	useEffect(() => {
		if (data?.article) {
			form.setFieldValue("title", data.article.title);
			form.setFieldValue(
				"content",
				data.article.previewContent || data.article.description || "",
			);
			form.setFieldValue("featuredImageUrl", data.article.featuredImageUrl);
			form.setFieldValue("tags", data.article.tags);
		}
	}, [data]);

	const onConfirmUpdate = () => {
		if (!data?.article.id) return;

		const value = form.state.values;
		updateMutation.mutate({
			articleId: data.article.id,
			title: value.title,
			description: value.content,
			featuredImageUrl: value.featuredImageUrl || "",
			tags: value.tags || [],
		});
		setShowUpdateConfirm(false);
	};

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() =>
						navigate({ to: "/articles/$articleId", params: { articleId } })
					}
					className="rounded-full"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						Edit Article
					</h1>
					<p className="text-sm text-zinc-500">
						Update your article content and settings.
					</p>
				</div>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
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
									field.state.meta.isTouched ? (
										<p className="text-sm text-destructive mt-1">
											{typeof field.state.meta.errors[0] === "string"
												? field.state.meta.errors[0]
												: (field.state.meta.errors[0] as any)?.message ||
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
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 &&
									field.state.meta.isTouched ? (
										<p className="text-sm text-destructive mt-1">
											{typeof field.state.meta.errors[0] === "string"
												? field.state.meta.errors[0]
												: (field.state.meta.errors[0] as any)?.message ||
													"Invalid input"}
										</p>
									) : null}
								</div>
							)}
						</form.Field>
					</div>

					<div className="w-full lg:w-[360px] space-y-6">
						<div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 space-y-6">
							<form.Field name="featuredImageUrl">
								{(field) => (
									<div className="space-y-2">
										<Label>Featured Image</Label>
										<ArticleImageUpload
											value={field.state.value}
											onChange={(url) => field.handleChange(url)}
											onRemove={() => field.handleChange("")}
										/>
										{field.state.meta.errors &&
										field.state.meta.errors.length > 0 &&
										field.state.meta.isTouched ? (
											<p className="text-sm text-destructive mt-1">
												{typeof field.state.meta.errors[0] === "string"
													? field.state.meta.errors[0]
													: (field.state.meta.errors[0] as any)?.message ||
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
													className="pl-2 pr-1 py-0.5 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900"
												>
													{tag}
													<button
														type="button"
														onClick={() =>
															field.handleChange(
																field.state.value?.filter((t) => t !== tag) ||
																	[],
															)
														}
														className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5"
													>
														<Plus className="h-3 w-3 rotate-45" />
													</button>
												</Badge>
											))}
										</div>
										<Input
											id="tags"
											placeholder="Add a tag and press Enter"
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
										field.state.meta.errors.length > 0 ? (
											<p className="text-sm text-destructive">
												{field.state.meta.errors.join(", ")}
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
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								size="lg"
								disabled={
									!canSubmit || isSubmitting || updateMutation.isPending
								}
								className="rounded-full px-8 h-14 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
							>
								{isSubmitting || updateMutation.isPending ? (
									<Loader2 className="h-5 w-5 mr-2 animate-spin" />
								) : (
									<Save className="h-5 w-5 mr-2" />
								)}
								{isSubmitting || updateMutation.isPending
									? "Updating..."
									: "Save Changes"}
							</Button>
						)}
					/>
				</div>
			</form>

			<ConfirmModal
				isOpen={showUpdateConfirm}
				onClose={() => setShowUpdateConfirm(false)}
				onConfirm={onConfirmUpdate}
				title="Update Article"
				message="Are you sure you want to save these changes to your article?"
				confirmText="Save changes"
				variant="default"
				isLoading={updateMutation.isPending}
			/>
		</div>
	);
}
