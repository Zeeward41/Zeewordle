import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string('the email must be a string')
        .email('Invalid email format')
        .max(100, 'The email must be less than 100 characters')
        .toLowerCase(),
    password: z
        .string()
        .min(5, 'The password must be at least 6 characters')
        .max(100, 'The password must be at most 100 characters'),
});

export const userSummarySchema = z.object({
    id: z.number().int(),
    username: z.string().min(5).max(15),
    email: z.string().max(100).email(),
    role: z.array(z.enum(['user', 'admin'])).nonempty(),
});

export const errorResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export const notificationsSchema = z.object({
    status: z.string(),
    message: z.string(),
});

export type loginInput = z.infer<typeof loginSchema>;
export type userSummaryType = z.infer<typeof userSummarySchema>;
export type errorResponseType = z.infer<typeof errorResponseSchema>;
export type notificationsType = z.infer<typeof notificationsSchema>;
