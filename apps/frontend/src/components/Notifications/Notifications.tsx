import './Notifications.css';
import { createPortal } from 'react-dom';
import { useNotification } from '../../hooks/useNotifications';
import { Icon } from './Icon';

export const Notifications = () => {
    const { notification } = useNotification();

    if (!notification) return null;

    return createPortal(
        <div className={`notification notification--${notification.status}`}>
            <div className="notification__header">
                <Icon
                    status={notification.status}
                    className="notification__header--icon"
                />
                <p className="notification__header--title">
                    {notification.status}
                </p>
            </div>
            <p className="notification__message">{notification.message}</p>
        </div>,
        document.body
    );
};
