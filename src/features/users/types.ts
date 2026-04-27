import type { UserRole, UserStatus } from "@/shared/types/user";

export interface GetUsersInput {
	page: number;
	limit: number;
	search?: string;
	role?: UserRole | UserRole[];
	status?: UserStatus;
	sort?: "recent" | "old";
}

export interface UserListItem {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	joinedAt: string;
	status: UserStatus;
}

export interface GetUsersResponse {
	users: UserListItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	totalUsers: number;
	totalMentors: number;
}

export interface BlockUserInput {
	userId: string;
}

export interface UnblockUserInput {
	userId: string;
}

export interface UserStatusMutationResponse {
	resourceId: string;
}
