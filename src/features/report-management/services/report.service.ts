import type { ApiSuccess } from "@/api/apiSuccess";
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
	reportArticle: async (input: ReportArticleInput) => {
		const response = await api.post<ApiSuccess<ReportArticleResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_ARTICLE(input.articleId)}`,
			{
				reason: input.reason,
				description: input.description,
			},
		);
		return response.data.data;
	},

	reportUser: async (input: ReportUserInput) => {
		const response = await api.post<ApiSuccess<ReportUserResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.REPORT_USER(input.userId)}`,
			{
				reason: input.reason,
				description: input.description,
			},
		);
		return response.data.data;
	},

	getReports: async (params: GetReportsInput) => {
		const response = await api.get<ApiSuccess<GetReportsResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.ROOT}`,
			{ params },
		);
		return response.data.data;
	},

	updateReportStatus: async (input: UpdateReportStatusInput) => {
		const response = await api.patch<ApiSuccess<UpdateReportStatusResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.STATUS(input.reportId)}`,
			{
				status: input.status,
				actionTaken: input.actionTaken,
			},
		);
		return response.data.data;
	},

	blockArticle: async (input: BlockArticleInput) => {
		const response = await api.patch<ApiSuccess<BlockArticleResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.BLOCK_ARTICLE(input.articleId)}`,
			{
				reason: input.reason,
				reportId: input.reportId,
			},
		);
		return response.data.data;
	},

	unblockArticle: async (articleId: string) => {
		const response = await api.patch<ApiSuccess<UnblockArticleResponse>>(
			`${ROUTES.REPORTS.BASE}${ROUTES.REPORTS.UNBLOCK_ARTICLE(articleId)}`,
		);
		return response.data.data;
	},
};
