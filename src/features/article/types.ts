export type ArticleReactionType = "LIKE" | "DISLIKE";

export interface ArticleAuthorSnapshot {
	name: string;
	avatarUrl: string;
}

export interface ArticleDto {
	id: string;
	authorId: string;
	authorSnapshot: ArticleAuthorSnapshot;
	slug: string;
	featuredImageUrl: string;
	title: string;
	description: string;
	previewContent: string;
	tags: string[];
	isActive: boolean;
	views: number;
	commentsCount: number;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ArticleCommentDto {
	id: string;
	articleId: string;
	parentId: string | null;
	userId: string;
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
	interest?: string;
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
	isArchived?: boolean;
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
	commentId: string;
}

export interface ReactToArticleInput {
	articleId: string;
	reactionType: ArticleReactionType;
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
