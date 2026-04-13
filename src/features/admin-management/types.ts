import type { UserStatus } from "@/shared/types/user";

export interface GetAdminsInput {
	page: number;
	limit: number;
	search?: string;
	status?: UserStatus;
	sort?: "recent" | "old";
}
export interface CreateAdminResponse {
	newAdminId: string;
}

export interface AdminListItem {
	id: string;
	name: string;
	email: string;
	addedAt: string;
	status: UserStatus;
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
