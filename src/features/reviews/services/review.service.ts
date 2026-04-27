import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	CreateReviewInput,
	CreateReviewResponse,
	GetMentorReviewsInput,
	GetMentorReviewsResponse,
} from "../types";

export const reviewService = {
	createReview: async (input: CreateReviewInput) => {
		const response = await api.post<ApiSuccess<CreateReviewResponse>>(
			`${ROUTES.REVIEWS.BASE}${ROUTES.REVIEWS.BOOKING(input.bookingId)}`,
			{
				rating: input.rating,
				comment: input.comment,
			},
		);
		return response.data;
	},

	getMentorReviews: async (input: GetMentorReviewsInput) => {
		const response = await api.get<ApiSuccess<GetMentorReviewsResponse>>(
			`${ROUTES.REVIEWS.BASE}${ROUTES.REVIEWS.MENTOR(input.mentorId)}`,
			{
				params: { page: input.page },
			},
		);
		return response.data;
	},
};
