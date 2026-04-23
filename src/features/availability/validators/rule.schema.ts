import { nameSchema } from "@/shared/validators/name.schema";
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
		name: nameSchema,
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

		const startDate = new Date(`${value.startDate}T00:00:00Z`);
		const endDate = new Date(`${value.endDate}T00:00:00Z`);
		if (
			!Number.isNaN(startDate.getTime()) &&
			!Number.isNaN(endDate.getTime())
		) {
			const diffMs = endDate.getTime() - startDate.getTime();
			const diffDays = diffMs / (1000 * 60 * 60 * 24);
			if (diffDays > 30) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Availability duration cannot exceed 30 days",
					path: ["endDate"],
				});
			}
		}

		const breaks = value.breakTimes ?? [];
		if (breaks.length > 5) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Maximum 5 break times allowed",
				path: ["breakTimes"],
			});
			return;
		}

		const toMinutes = (time: string) => {
			const [h, m] = time.split(":").map(Number);
			return h * 60 + m;
		};

		const sorted = breaks
			.map((bt, index) => ({
				index,
				start: toMinutes(bt.startTime),
				end: toMinutes(bt.endTime),
			}))
			.sort((a, b) => a.start - b.start);

		for (let i = 0; i < sorted.length; i += 1) {
			const currentBreak = sorted[i];
			const breakDuration = currentBreak.end - currentBreak.start;
			if (breakDuration <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Break end time must be after start time",
					path: ["breakTimes", currentBreak.index, "endTime"],
				});
				continue;
			}
			if (breakDuration < 5 || breakDuration > 120) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Break duration must be between 5 minutes and 2 hours",
					path: ["breakTimes", currentBreak.index, "endTime"],
				});
			}
			const nextBreak = sorted[i + 1];
			if (nextBreak && currentBreak.end > nextBreak.start) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Break times must not overlap",
					path: ["breakTimes"],
				});
				break;
			}
		}
	});

export type AvailabilityFormValues = Omit<
	z.infer<typeof availabilityRuleSchema>,
	"bufferTime"
> & {
	bufferTime: number | "";
};
