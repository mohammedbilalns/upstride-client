export interface ReviewDto {
	id: string;
	mentorId: string;
	userId: string;
	bookingId: string;
	rating: number;
	comment: string;
	reviewerName: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateReviewInput {
	bookingId: string;
	rating: number;
	comment: string;
}

export interface CreateReviewResponse {
	review: ReviewDto;
}

export interface GetMentorReviewsInput {
	mentorId: string;
	page?: number;
}

export interface GetMentorReviewsResponse {
	reviews: ReviewDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
