import { z } from 'zod';

export const notificationsSchema = z.object({
    status: z.string(),
    message: z.string(),
});

export type notificationsType = z.infer<typeof notificationsSchema>;
