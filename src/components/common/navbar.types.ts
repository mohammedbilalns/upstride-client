import type { navLinks } from "./navbar.constants";

export type NavLinkItem = (typeof navLinks)[number];

export type NavbarUser = {
	name?: string;
	role?: string;
	profilePictureUrl?: string;
} | null;
