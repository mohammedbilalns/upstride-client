import z from "zod";

export const pageSchema = z.number().int().positive().catch(1);
export const limitSchema = z
	.number()
	.int()
	.refine((val) => [10, 20, 50].includes(val))
	.catch(10);

export const searchSchema = z.string().optional().catch("");
