import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import './ModalWrapper.css';

interface ModalWrapperProps {
    onClose: () => void;
    children: ReactNode;
}

export const ModalWrapper = ({ onClose, children }: ModalWrapperProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);
    return createPortal(
        <div
            className="modal-wrapper"
            onClick={onClose}
            onKeyDown={e => {
                if (e.key === 'Escape') {
                    onClose();
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div
                className="modal-wrapper__content"
                onClick={e => e.stopPropagation()}
                role="presentation"
            >
                {children}
            </div>
        </div>,
        document.body
    );
};
