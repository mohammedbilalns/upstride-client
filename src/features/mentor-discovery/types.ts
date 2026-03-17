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
