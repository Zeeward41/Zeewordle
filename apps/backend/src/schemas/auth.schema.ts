import { z } from 'zod';

export const registerSchema = z
    .object({
        email: z
            .email({ message: 'The email is invalid' })
            .toLowerCase()
            .trim()
            .max(100, {
                message: 'The email must be less than 100 characters',
            }),
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
            })
            .optional(),
        google_id: z.string().optional(),
    })
    .refine(data => data.password ?? data.google_id, {
        message: 'A password is required unless registering via Google',
        path: ['password'],
    });

export const googleAuthSchema = z.object({
    idToken: z.string().min(1, {
        message: 'The Google ID token is required',
    }),
});

export type GoogleAuthRequest = z.infer<typeof googleAuthSchema>;

export type RegisterRequest = z.infer<typeof registerSchema>;
