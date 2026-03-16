import { z } from "zod";

export const percentageSchema = z.coerce
	.number("Please enter a valid number")
	.min(0, "Percentage must be at least 0")
	.max(100, "Percentage must be at most 100");

export const nonNegativeIntSchema = z.coerce
	.number("Please enter a valid number")
	.int("Must be a whole number")
	.min(0, "Value must be at least 0");

export const positiveIntSchema = z.coerce
	.number("Please enter a valid number")
	.int("Must be a whole number")
	.positive("Value must be greater than 0");
