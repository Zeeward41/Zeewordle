import { z } from 'zod';

const registerSchema = z.object({
    email: z
        .string()
        .email({ message: 'The email is invalid' })
        .toLowerCase()
        .trim()
        .max(100, { message: 'The email must be less than 100 characters' }),
    username: z
        .string()
        .min(5, { message: 'The username must be at least 5 characters' })
        .max(15, {
            message: 'The username must have a maximum of 15 characters',
        }),
    password: z
        .string()
        .min(5, { message: 'The password must be at least 5 characters' })
        .max(100, {
            message: 'The password must have a maximum of 100 characters',
        }),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
