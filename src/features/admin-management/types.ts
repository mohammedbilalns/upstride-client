export type UserRole = "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";

export interface GetAdminsInput {
	page: number;
	limit: number;
	search?: string;
	status?: "active" | "blocked";
	sort?: "recent" | "old";
}

export interface AdminListItem {
	id: string;
	name: string;
	email: string;
	addedAt: string;
	status: "active" | "blocked";
}

export interface GetAdminsResponse {
	admins: AdminListItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateAdminInput {
	email: string;
	password: string;
}

export interface BlockAdminInput {
	adminId: string;
}

export interface UnblockAdminInput {
	adminId: string;
}
