import z from "zod";
export const nameSchema = z
	.string()
	.trim()
	.min(2)
	.max(50)
	.regex(/^[\p{L}\s'-]+$/u, "Invalid name format");
