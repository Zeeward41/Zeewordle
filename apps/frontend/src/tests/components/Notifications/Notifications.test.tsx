import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Notifications } from '../../../components/Notifications/Notifications';
import { useNotification } from '../../../hooks/useNotifications';

vi.mock('../../../hooks/useNotifications.ts', () => ({
    useNotification: vi.fn(),
}));

describe('Composant <Notification />', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should render nothing when there is no active notification', () => {
        vi.mocked(useNotification).mockReturnValue({
            notification: null,
            showNotification: vi.fn(),
        });

        const { container } = render(<Notifications />);

        expect(container.firstChild).toBeNull();
    });
    it('should correctly render the notification inside document.body', () => {
        vi.mocked(useNotification).mockReturnValue({
            notification: {
                status: 'success',
                message: 'Your profile has been successfully updated.',
            },
            showNotification: vi.fn(),
        });

        render(<Notifications />);

        const messageElement = screen.getByText(
            /Your profile has been successfully updated./i
        );
        const titleElement = document.querySelector(
            '.notification__header--title'
        );

        expect(messageElement).toBeInTheDocument();
        expect(titleElement).toBeInTheDocument();
    });
});
