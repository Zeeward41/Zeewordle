import { useState } from 'react';
import { NotificationsContext } from '../contexts/NotificationsContext.tsx';
import type { notificationsType } from '../schemas/notifications.schema.ts';

interface NotificationsProviderProps {
    children: React.ReactNode;
}

export function NotificationsProvider({
    children,
}: NotificationsProviderProps) {
    const [notification, setNotification] = useState<notificationsType | null>(
        null
    );

    const showNotification = (notif: notificationsType) => {
        setNotification(notif);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <NotificationsContext value={{ notification, showNotification }}>
            {children}
        </NotificationsContext>
    );
}
