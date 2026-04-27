import type { CatalogInterest } from "../onboarding/types";

export interface MentorList {
	id: string;
	name: string;
	description: string | null;
	mentorCount?: number;
	createdAt: string;
	updatedAt: string;
}

export interface GetMentorListsResponse {
	items: MentorList[];
}

export interface GetMentorListResponse {
	list: MentorListDetails;
}

export interface CreateMentorListInput {
	name: string;
	description?: string | null;
}

export interface CreateMentorListResponse {
	list: MentorList;
}

export interface AddMentorToListInput {
	listId: string;
	mentorId: string;
}

export interface RemoveMentorFromListInput {
	listId: string;
	mentorId: string;
}

export interface DeleteMentorListInput {
	listId: string;
}

export interface MentorListDetails extends MentorList {
	mentors: MentorDiscoveryItem[];
}

export interface GetMentorsDiscoveryInput {
	page: number;
	search?: string;
	category?: string;
	tierId?: string;
	minExperience?: number;
	maxExperience?: number;
	sort?: "recent";
}

export interface MentorDiscoveryItem {
	id: string;
	userId: string;
	name: string;
	avatar?: string;
	designation?: string;
	bio: string;
	yearsOfExperience: number;
	avgRating: number;
	tierId: string | null;
	categoryIds: string[];
	categories: {
		id: string;
		name?: string;
	}[];
	skills: {
		id: string;
		name?: string;
	}[];
	createdAt: string;
}

export interface GetMentorsDiscoveryResponse {
	items: MentorDiscoveryItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetCategoriesResponse {
	interests: CatalogInterest[];
}
