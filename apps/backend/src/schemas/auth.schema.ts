import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Email invalide').max(100),
    username: z.string().min(5, 'Too Short!').max(15),
    password: z.string().min(5).max(100),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
