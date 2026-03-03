export type UserRole = "user" | "mentor" | "admin" | "superadmin";

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	isActive: boolean;
	createdAt: Date;
	isBlocked?: boolean;
}
