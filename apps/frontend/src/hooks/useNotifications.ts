import { NotificationsContext } from '../contexts/NotificationsContext';
import { useContext } from 'react';

export const useNotification = () => {
    const context = useContext(NotificationsContext);
    if (!context)
        throw new Error(
            'useNotification must be used within a NotificationsProvider'
        );
    return context;
};
