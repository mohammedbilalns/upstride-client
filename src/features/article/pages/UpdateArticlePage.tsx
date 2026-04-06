import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { articleQueries } from "../hooks/queries";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Route } from "@/routes/_app-layout/_user-layout/mentor/articles/$articleId/update";
import { ArticleNotFound } from "../components/ArticleNotFound";
import { ArticleForm, type ArticleFormValues } from "../components/ArticleForm";
import { useUpdateArticleMutation } from "../hooks/mutations";

export function UpdateArticlePage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const router = useRouter();
	const { articleId } = Route.useParams();
	const { data } = useQuery(articleQueries.detail(articleId));

	const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
	const [pendingValues, setPendingValues] = useState<ArticleFormValues | null>(
		null,
	);

	const currentUserId = router.options.context?.auth?.user?.id;
	if (data?.article && currentUserId) {
		if (data.article.authorId !== currentUserId) {
			return (
				<ArticleNotFound
					backTo="/mentor-articles"
					backLabel="Back to Articles"
				/>
			);
		}
	}

	const updateMutation = useUpdateArticleMutation();

	const defaultValues = {
		title: data?.article?.title || "",
		content: data?.article?.description || "",
		featuredImageUrl: data?.article?.featuredImageId || "",
		tags: data?.article?.tags,
	};

	const onConfirmUpdate = () => {
		if (!data?.article.id) return;

		if (!pendingValues) return;

		updateMutation.mutate(
			{
				articleId: data.article.id,
				title: pendingValues.title,
				description: pendingValues.content,
				featuredImageUrl: pendingValues.featuredImageUrl || "",
				tags: pendingValues.tags || [],
			},
			{
				onSuccess: () => {
					navigate({ to: "/articles/$articleId", params: { articleId } });
				},
			},
		);
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
					className="rounded-full text-primary hover:text-primary/90 hover:bg-primary/10"
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

			<ArticleForm
				defaultValues={defaultValues}
				onSubmit={(values) => {
					setPendingValues(values);
					setShowUpdateConfirm(true);
				}}
				submitText="Save Changes"
				submittingText="Updating..."
				isPending={updateMutation.isPending}
				previewUrl={data?.article.featuredImageUrl}
			/>

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
