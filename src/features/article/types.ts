type ArticleReactionType = "LIKE";

interface ArticleAuthorSnapshot {
	name: string;
	avatarUrl?: string;
	isBlocked?: boolean;
}

export interface ArticleDto {
	id: string;
	authorId: string;
	authorSnapshot: ArticleAuthorSnapshot;
	slug: string;
	featuredImageUrl: string;
	featuredImageId: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	views: number;
	commentsCount: number;
	likesCount: number;
	isBlockedByAdmin: boolean;
	blockingReason: string | null;
	createdAt: string;
}

export interface ReportInput {
	reason: string;
	description: string;
}

export interface ReportResponse {
	id: string;
}

export interface ArticleCommentDto {
	id: string;
	articleId: string;
	parentId: string | null;
	userId: string;
	authorSnapshot: {
		name: string;
		avatarUrl?: string;
	};
	likesCount: number;
	repliesCount: number;
	content: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ArticleReactionDto {
	id: string;
	resourceId: string;
	userId: string;
	reactionType: ArticleReactionType;
	createdAt: string;
}

export interface GetArticlesInput {
	page: number;
	search?: string;
	skill?: string;
	category?: string;
	authorId?: string;
	limit?: number;
}

export type MentorArticlesStatus = "active" | "blocked";

export interface GetMentorArticlesInput {
	page: number;
	search?: string;
	status?: MentorArticlesStatus;
}

export interface GetTopTagsResponse {
	tags: { tag: string; count: number }[];
}

export interface GetArticlesResponse {
	items: ArticleDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetArticleResponse {
	article: ArticleDto;
	isAuthor?: boolean;
	userReaction?: ArticleReactionType;
	isReported?: boolean;
	appealMessage?: string | null;
	appealedAt?: string | null;
}

export interface SubmitAppealInput {
	articleId: string;
	message: string;
}

export interface CreateArticleInput {
	title: string;
	description: string;
	featuredImageUrl: string;
	tags?: string[];
}

export interface CreateArticleResponse {
	article: ArticleDto;
}

export interface UpdateArticleInput {
	articleId: string;
	title?: string;
	description?: string;
	featuredImageUrl?: string;
	tags?: string[];
}

export interface UpdateArticleResponse {
	article: ArticleDto;
}

export interface DeleteArticleInput {
	articleId: string;
}

export interface GetCommentsInput {
	articleId: string;
	page: number;
	parentId?: string | null;
}

export interface GetCommentsResponse {
	items: ArticleCommentDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateCommentInput {
	articleId: string;
	content: string;
	parentId?: string | null;
}

export interface CreateCommentResponse {
	comment: ArticleCommentDto;
}

export interface UpdateCommentInput {
	commentId: string;
	content: string;
}

export interface UpdateCommentResponse {
	comment: ArticleCommentDto;
}

export interface DeleteCommentInput {
	articleId: string;
	commentId: string;
}

export interface DeleteCommentResponse {
	commentId: string;
}

export interface ReactToArticleInput {
	articleId: string;
}

export interface ReactToArticleResponse {
	reaction: ArticleReactionDto;
}

export interface ReactToCommentInput {
	commentId: string;
	reactionType: ArticleReactionType;
}

export interface ReactToCommentResponse {
	reaction: ArticleReactionDto;
}
