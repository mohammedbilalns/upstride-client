import type { ApiSuccess } from "@/api/apiSuccess";
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
	GetMentorArticlesInput,
	GetTopTagsResponse,
	ReactToArticleInput,
	ReactToArticleResponse,
	ReactToCommentInput,
	ReactToCommentResponse,
	ReportInput,
	ReportResponse,
	SubmitAppealInput,
	UpdateArticleInput,
	UpdateArticleResponse,
	UpdateCommentInput,
	UpdateCommentResponse,
} from "../types";

export const articleService = {
	getArticles: async (input: GetArticlesInput) => {
		const { category, ...rest } = input;
		const response = await api.get<ApiSuccess<GetArticlesResponse>>(
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
		status?: GetMentorArticlesInput["status"];
	}) => {
		const response = await api.get<ApiSuccess<GetArticlesResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.MENTOR}`,
			{ params },
		);
		return response.data.data;
	},

	getTopTags: async () => {
		const response = await api.get<ApiSuccess<GetTopTagsResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.TOP_TAGS}`,
		);
		return response.data.data;
	},

	getArticle: async (slug: string) => {
		const response = await api.get<ApiSuccess<GetArticleResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.BY_SLUG(slug)}`,
		);
		return response.data.data;
	},

	createArticle: async (input: CreateArticleInput) => {
		const response = await api.post<ApiSuccess<CreateArticleResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ROOT}`,
			input,
		);
		return response.data.data;
	},

	updateArticle: async (input: UpdateArticleInput) => {
		const response = await api.patch<ApiSuccess<UpdateArticleResponse>>(
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

	getComments: async (input: GetCommentsInput) => {
		const response = await api.get<ApiSuccess<GetCommentsResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENTS(input.articleId)}`,
			{ params: { page: input.page, parentId: input.parentId } },
		);
		return response.data.data;
	},

	createComment: async (input: CreateCommentInput) => {
		const response = await api.post<ApiSuccess<CreateCommentResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENTS(input.articleId)}`,
			{ content: input.content, parentId: input.parentId },
		);
		return response.data.data;
	},

	updateComment: async (input: UpdateCommentInput) => {
		const response = await api.patch<ApiSuccess<UpdateCommentResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_BY_ID(input.commentId)}`,
			{ content: input.content },
		);
		return response.data.data;
	},

	deleteComment: async (input: DeleteCommentInput) => {
		const response = await api.delete<ApiSuccess<DeleteCommentResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_BY_ID(input.commentId)}`,
		);
		return response.data.data;
	},

	reactToArticle: async (input: ReactToArticleInput) => {
		const response = await api.post<ApiSuccess<ReactToArticleResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.ARTICLE_REACTIONS(input.articleId)}`,
			{},
		);
		return response.data.data;
	},

	reactToComment: async (input: ReactToCommentInput) => {
		const response = await api.post<ApiSuccess<ReactToCommentResponse>>(
			`${ROUTES.ARTICLES.BASE}${ROUTES.ARTICLES.COMMENT_REACTIONS(input.commentId)}`,
			{ reactionType: input.reactionType },
		);
		return response.data.data;
	},

	reportArticle: async (articleId: string, input: ReportInput) => {
		const response = await api.post<ApiSuccess<ReportResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_ARTICLE(articleId)}`,
			input,
		);
		return response.data.data;
	},

	reportUser: async (userId: string, input: ReportInput) => {
		const response = await api.post<ApiSuccess<ReportResponse>>(
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
