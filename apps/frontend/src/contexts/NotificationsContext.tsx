import { createContext } from 'react';
import type { notificationsType } from '../schemas/notifications.schema.ts';

interface NotificationsContextType {
    notification: notificationsType | null;
    showNotification: (notification: notificationsType) => void;
}

export const NotificationsContext =
    createContext<NotificationsContextType | null>(null);
