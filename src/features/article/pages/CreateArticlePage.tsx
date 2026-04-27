import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Route } from "@/routes/_app-layout/_user-layout/mentor/articles/create";
import { ArticleForm } from "../components/ArticleForm";
import { useCreateArticleMutation } from "../hooks/mutations";

export function CreateArticlePage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const createMutation = useCreateArticleMutation();

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/mentor-articles" })}
					className="rounded-full text-primary hover:text-primary/90 hover:bg-primary/10"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						Create New Article
					</h1>
					<p className="text-sm text-zinc-500">
						Share your thoughts and expertise with the community.
					</p>
				</div>
			</div>

			<ArticleForm
				defaultValues={{
					title: "",
					content: "",
					featuredImageUrl: "",
					tags: undefined,
				}}
				onSubmit={(values) => {
					createMutation.mutate(
						{
							title: values.title,
							description: values.content,
							featuredImageUrl: values.featuredImageUrl || "",
							tags: values.tags,
						},
						{
							onSuccess: () => {
								navigate({ to: "/mentor-articles" });
							},
						},
					);
				}}
				submitText="Publish Article"
				submittingText="Publishing..."
				isPending={createMutation.isPending}
			/>
		</div>
	);
}
