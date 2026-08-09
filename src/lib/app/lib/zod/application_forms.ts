import z from 'zod';

export const membershipApplicationSchema = z.object({
	studentNumber: z.string().trim().min(1, 'Student number is required'),
	name: z.string().trim().min(1, 'Name is required'),
	program: z.string().trim().min(1, 'Program is required'),
	year: z
		.number()
		.int()
		.positive()
		.min(1, 'Year must be greater than 0')
		.max(10, 'Year must be no more than 10')
});

export type MembershipApplicationForm = z.infer<typeof membershipApplicationSchema>;
