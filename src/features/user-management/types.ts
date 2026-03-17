export type UserRole = "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";

export interface GetUsersInput {
	page: number;
	limit: number;
	search?: string;
	role?: UserRole | UserRole[];
	status?: "active" | "blocked";
	sort?: "recent" | "old";
}

export interface UserListItem {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	joinedAt: string;
	status: "active" | "blocked";
}

export interface GetUsersResponse {
	users: UserListItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface BlockUserInput {
	userId: string;
}

export interface UnblockUserInput {
	userId: string;
}
