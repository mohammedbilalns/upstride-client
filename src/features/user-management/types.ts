export type UserRole = "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";

export interface GetUsersInput {
	page: number;
	limit: number;
	search?: string;
	role?: UserRole | UserRole[];
	status?: "active" | "blocked";
	sort?: "recent" | "old";
}

export interface UserListDTO {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	joinedAt: string;
	status: "active" | "blocked";
	profilePictureUrl: string | null;
}

export interface GetUsersResponse {
	users: UserListDTO[];
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
