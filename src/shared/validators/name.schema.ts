import z from "zod";
export const nameSchema = z
	.string()
	.trim()
	.min(2, "Name must be at least 2 characters long")
	.max(50, "Name must be at most 50 characters long")
	.regex(
		/^[\p{L}\s'-]+$/u,
		"Name can only contain letters, spaces, apostrophes, and hyphens",
	);
