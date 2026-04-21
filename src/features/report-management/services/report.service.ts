import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BlockArticleInput,
	BlockArticleResponse,
	GetReportsInput,
	GetReportsResponse,
	ReportArticleInput,
	ReportArticleResponse,
	ReportUserInput,
	ReportUserResponse,
	UnblockArticleResponse,
	UpdateReportStatusInput,
	UpdateReportStatusResponse,
} from "../types";

export const ReportManagementService = {
	reportArticle: async (
		input: ReportArticleInput,
	): Promise<ReportArticleResponse> => {
		const response = await api.post<{ data: ReportArticleResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_ARTICLE(input.articleId)}`,
			{
				reason: input.reason,
				description: input.description,
			},
		);
		return response.data.data;
	},

	reportUser: async (input: ReportUserInput): Promise<ReportUserResponse> => {
		const response = await api.post<{ data: ReportUserResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_USER(input.userId)}`,
			{
				reason: input.reason,
				description: input.description,
			},
		);
		return response.data.data;
	},

	getReports: async (params: GetReportsInput): Promise<GetReportsResponse> => {
		const response = await api.get<{ data: GetReportsResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.ROOT}`,
			{ params },
		);
		return response.data.data;
	},

	updateReportStatus: async (
		input: UpdateReportStatusInput,
	): Promise<UpdateReportStatusResponse> => {
		const response = await api.patch<{ data: UpdateReportStatusResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.STATUS(input.reportId)}`,
			{
				status: input.status,
				actionTaken: input.actionTaken,
			},
		);
		return response.data.data;
	},

	blockArticle: async (
		input: BlockArticleInput,
	): Promise<BlockArticleResponse> => {
		const response = await api.patch<{ data: BlockArticleResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.BLOCK_ARTICLE(input.articleId)}`,
			{
				reason: input.reason,
				reportId: input.reportId,
			},
		);
		return response.data.data;
	},

	unblockArticle: async (
		articleId: string,
	): Promise<UnblockArticleResponse> => {
		const response = await api.patch<{ data: UnblockArticleResponse }>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.UNBLOCK_ARTICLE(articleId)}`,
		);
		return response.data.data;
	},
};
