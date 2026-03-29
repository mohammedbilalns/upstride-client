import type { ArticleDto } from "@/features/article/types";

export type ReportTargetType = "USER" | "ARTICLE";
export type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED" | "CLOSED";
export type ReportDecisionStatus = "RESOLVED" | "REJECTED";

export interface ReportDto {
	id: string;
	reporterId: string;
	targetId: string;
	targetType: ReportTargetType;
	reason: string;
	description: string;
	status: ReportStatus;
	reporter?: { id: string; name: string; email: string };
	target?: {
		id: string;
		name?: string;
		email?: string;
		title?: string;
		slug?: string;
		blockingReason?: string;
	};
	targetSlug?: string;
	appealMessage: string | null;
	appealedAt: string | null;
	isAppealSubmitted: boolean;
	actionTaken?: string;
	actionTakenAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ReportBodyInput {
	reason: string;
	description: string;
}

export interface ReportArticleInput extends ReportBodyInput {
	articleId: string;
}

export interface ReportArticleResponse {
	report: ReportDto;
}

export interface ReportUserInput extends ReportBodyInput {
	userId: string;
}

export interface ReportUserResponse {
	report: ReportDto;
}

export interface GetReportsInput {
	page: number;
	limit: number;
	status?: ReportStatus | ReportStatus[];
	targetType?: ReportTargetType | ReportTargetType[];
	targetId?: string;
	reporterId?: string;
	isAppealSubmitted?: boolean;
}

export interface GetReportsResponse {
	reports: ReportDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface UpdateReportStatusInput {
	reportId: string;
	status: ReportDecisionStatus;
	actionTaken?: string;
}

export interface UpdateReportStatusResponse {
	report: ReportDto;
}

export interface BlockArticleInput {
	articleId: string;
	reason: string;
	reportId?: string;
}

export interface BlockArticleResponse {
	article: ArticleDto;
}
