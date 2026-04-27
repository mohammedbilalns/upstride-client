import type { GetArticlesInput, MentorArticlesStatus } from "../../types";

export const articleKeys = {
	all: ["articles"] as const,

	lists: () => [...articleKeys.all, "list"] as const,
	list: (params: GetArticlesInput) => [...articleKeys.lists(), params] as const,

	infinteList: (params: Omit<GetArticlesInput, "page">) =>
		[...articleKeys.lists(), "infinte", params] as const,

	mentorListInfinite: (
		params: { search?: string; status?: MentorArticlesStatus } = {},
	) => [...articleKeys.lists(), "mentor-infinte", params] as const,

	details: () => [...articleKeys.all, "detail"] as const,

	detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,

	topTags: () => [...articleKeys.all, "top-tags"] as const,

	comments: (params: {
		articleId: string;
		page: number;
		parentId?: string | null;
	}) => [...articleKeys.all, params.articleId, "comments", params] as const,
	commentsInfinite: (params: { articleId: string; parentId?: string | null }) =>
		[...articleKeys.all, params.articleId, "comments-infinte", params] as const,
};
