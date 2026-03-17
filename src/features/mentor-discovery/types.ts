export interface MentorList {
	id: string;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface GetMentorListsResponse {
	items: MentorList[];
}

export interface GetMentorListResponse {
	list: MentorList;
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

export interface GetMentorsDiscoveryInput {
	page: number;
	search?: string;
	categoryId?: string;
	tierId?: string;
	minExperience?: number;
	maxExperience?: number;
	sort?: "rating" | "recent";
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
