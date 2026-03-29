import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	CreateArticleInput,
	CreateArticleResponse,
	CreateCommentInput,
	CreateCommentResponse,
	DeleteArticleInput,
	DeleteCommentInput,
	DeleteCommentResponse,
	GetArticleResponse,
	GetArticlesInput,
	GetArticlesResponse,
	GetCommentsInput,
	GetCommentsResponse,
	GetTopTagsResponse,
	ReactToArticleInput,
	ReactToArticleResponse,
	ReactToCommentInput,
	ReactToCommentResponse,
	ReportInput,
	ReportResponse,
	UpdateArticleInput,
	UpdateArticleResponse,
	UpdateCommentInput,
	UpdateCommentResponse,
	SubmitAppealInput,
} from "../types";

export const articleService = {
	getArticles: async (
		input: GetArticlesInput,
	): Promise<GetArticlesResponse> => {
		const { category, ...rest } = input;
		const response = await api.get<{ data: GetArticlesResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ROOT}`,
			{
				params: {
					...rest,
					interest: category,
				},
			},
		);
		return response.data.data;
	},

	getMentorArticles: async (params: {
		page: number;
		search?: string;
	}): Promise<GetArticlesResponse> => {
		const response = await api.get<{ data: GetArticlesResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.MENTOR}`,
			{ params },
		);
		return response.data.data;
	},

	getTopTags: async (): Promise<GetTopTagsResponse> => {
		const response = await api.get<{ data: GetTopTagsResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.TOP_TAGS}`,
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
			},
		);
		return response.data.data;
	},

	deleteArticle: async (input: DeleteArticleInput): Promise<void> => {
		await api.delete(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.BY_ID(input.articleId)}`,
		);
	},

	getComments: async (
		input: GetCommentsInput,
	): Promise<GetCommentsResponse> => {
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

	deleteComment: async (
		input: DeleteCommentInput,
	): Promise<DeleteCommentResponse> => {
		const response = await api.delete<{ data: DeleteCommentResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_BY_ID(input.commentId)}`,
		);
		return response.data.data;
	},

	reactToArticle: async (
		input: ReactToArticleInput,
	): Promise<ReactToArticleResponse> => {
		const response = await api.post<{ data: ReactToArticleResponse }>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ARTICLE_REACTIONS(input.articleId)}`,
			{},
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

	reportArticle: async (
		articleId: string,
		input: ReportInput,
	): Promise<ReportResponse> => {
		const response = await api.post<{ data: ReportResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_ARTICLE(articleId)}`,
			input,
		);
		return response.data.data;
	},

	reportUser: async (
		userId: string,
		input: ReportInput,
	): Promise<ReportResponse> => {
		const response = await api.post<{ data: ReportResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_USER(userId)}`,
			input,
		);
		return response.data.data;
	},

	submitAppeal: async (input: SubmitAppealInput): Promise<void> => {
		await api.post(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.APPEAL(input.articleId)}`,
			{ message: input.message },
		);
	},
};
