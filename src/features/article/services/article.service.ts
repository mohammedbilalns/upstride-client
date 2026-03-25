import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	CreateArticleInput,
	CreateArticleResponse,
	CreateCommentInput,
	CreateCommentResponse,
	DeleteArticleInput,
	DeleteCommentInput,
	GetArticleResponse,
	GetArticlesInput,
	GetArticlesResponse,
	GetCommentsInput,
	GetCommentsResponse,
	ReactToArticleInput,
	ReactToArticleResponse,
	ReactToCommentInput,
	ReactToCommentResponse,
	UpdateArticleInput,
	UpdateArticleResponse,
	UpdateCommentInput,
	UpdateCommentResponse,
} from "../types";

export const articleService = {
	getArticles: async (input: GetArticlesInput): Promise<GetArticlesResponse> => {
		const response = await api.get<{ data: GetArticlesResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ROOT}`,
			{ params: input },
		);
		return response.data.data;
	},

	getArticle: async (slug: string): Promise<GetArticleResponse> => {
		const response = await api.get<{ data: GetArticleResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.BY_SLUG(slug)}`,
		);
		return response.data.data;
	},

	createArticle: async (
		input: CreateArticleInput,
	): Promise<CreateArticleResponse> => {
		const response = await api.post<{ data: CreateArticleResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ROOT}`,
			input,
		);
		return response.data.data;
	},

	updateArticle: async (
		input: UpdateArticleInput,
	): Promise<UpdateArticleResponse> => {
		const response = await api.patch<{ data: UpdateArticleResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.BY_ID(input.articleId)}`,
			{
				title: input.title,
				description: input.description,
				featuredImageUrl: input.featuredImageUrl,
				tags: input.tags,
				isArchived: input.isArchived,
			},
		);
		return response.data.data;
	},

	deleteArticle: async (input: DeleteArticleInput): Promise<void> => {
		await api.delete(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.BY_ID(input.articleId)}`,
		);
	},

	getComments: async (input: GetCommentsInput): Promise<GetCommentsResponse> => {
		const response = await api.get<{ data: GetCommentsResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENTS(input.articleId)}`,
			{ params: { page: input.page, parentId: input.parentId } },
		);
		return response.data.data;
	},

	createComment: async (
		input: CreateCommentInput,
	): Promise<CreateCommentResponse> => {
		const response = await api.post<{ data: CreateCommentResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENTS(input.articleId)}`,
			{ content: input.content, parentId: input.parentId },
		);
		return response.data.data;
	},

	updateComment: async (
		input: UpdateCommentInput,
	): Promise<UpdateCommentResponse> => {
		const response = await api.patch<{ data: UpdateCommentResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_BY_ID(input.commentId)}`,
			{ content: input.content },
		);
		return response.data.data;
	},

	deleteComment: async (input: DeleteCommentInput): Promise<void> => {
		await api.delete(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_BY_ID(input.commentId)}`,
		);
	},

	reactToArticle: async (
		input: ReactToArticleInput,
	): Promise<ReactToArticleResponse> => {
		const response = await api.post<{ data: ReactToArticleResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ARTICLE_REACTIONS(input.articleId)}`,
			{ reactionType: input.reactionType },
		);
		return response.data.data;
	},

	reactToComment: async (
		input: ReactToCommentInput,
	): Promise<ReactToCommentResponse> => {
		const response = await api.post<{ data: ReactToCommentResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_REACTIONS(input.commentId)}`,
			{ reactionType: input.reactionType },
		);
		return response.data.data;
	},
};
