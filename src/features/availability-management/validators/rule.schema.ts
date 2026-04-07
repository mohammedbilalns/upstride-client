import { z } from "zod";

export const DaySchema = z.enum([
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
]);

export const availabilityRuleSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.max(100, "Name must be at most 100 characters"),
		description: z
			.string()
			.trim()
			.min(10, "Description must be at least 10 characters")
			.max(1000, "Description must be at most 1000 characters"),
		days: z.array(DaySchema).min(1, "At least one day is required"),
		startTime: z
			.string()
			.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
		endTime: z
			.string()
			.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
		startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
		endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
		breakTimes: z
			.array(
				z.object({
					startTime: z
						.string()
						.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
					endTime: z
						.string()
						.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
				}),
			)
			.default([]),
		slotDuration: z.union([z.literal(30), z.literal(60)]),
		bufferTime: z
			.number()
			.int()
			.min(5, "Buffer time must be between 5 and 60 minutes")
			.max(60, "Buffer time must be between 5 and 60 minutes"),
	})
	.superRefine((value, ctx) => {
		const [startH, startM] = value.startTime.split(":").map(Number);
		const [endH, endM] = value.endTime.split(":").map(Number);
		const start = startH * 60 + startM;
		const end = endH * 60 + endM;
		if (end <= start) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "End time must be after start time",
				path: ["endTime"],
			});
			return;
		}
		if (end - start < 60) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Availability must be at least 1 hour",
				path: ["endTime"],
			});
		}
	});

export type AvailabilityFormValues = Omit<
	z.infer<typeof availabilityRuleSchema>,
	"bufferTime"
> & {
	bufferTime: number | "";
};
