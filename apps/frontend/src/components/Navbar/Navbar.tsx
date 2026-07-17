import './Navbar.css';
import { useAuth } from '../../hooks/useAuth';
import { ModalWrapper } from '../ModalWrapper/ModalWrapper';
import { ModalHomeMenu } from '../ModalHomeMenu/ModalHomeMenu';
import { ModalUserMenu } from '../ModalUserMenu/ModalUserMenu.tsx';
import { useState, useRef, useEffect } from 'react';

interface MenuPositionType {
    top: number;
    left: number;
}

export const Navbar = () => {
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const navbarRightRef = useRef<HTMLDivElement>(null);
    const [positionModal, setPositionModal] = useState<MenuPositionType | null>(
        null
    );

    const modalPosition = () => {
        if (navbarRightRef.current) {
            const position = navbarRightRef.current.getBoundingClientRect();
            setPositionModal({
                top: position.bottom + 8,
                left: position.left - 75,
            });
        }
    };

    const handlerModal = () => {
        modalPosition();
        setOpenModal(!openModal);
    };

    useEffect(() => {
        if (!openModal) return;

        window.addEventListener('resize', modalPosition);

        return () => {
            window.removeEventListener('resize', modalPosition);
        };
    }, [openModal]);

    return (
        <div className="navbar__wrapper">
            <div className="navbar">
                <div className="navbar__left">
                    <a href="/" className="navbar__link">
                        <img
                            src="/pen-Zeewordle.png"
                            alt="logo website"
                            className="navbar__logo"
                        />
                    </a>
                    <a href="/" className="navbar__apidoc">
                        API DOC
                    </a>
                </div>
                <span className="navbar__title">Zeewordle</span>
                <div className="navbar__right" ref={navbarRightRef}>
                    {user === null ? (
                        <>
                            <a href="/auth/login" className="navbar__login">
                                Login
                            </a>
                            <a href="/auth/register" className="navbar__signup">
                                Sign up
                            </a>
                        </>
                    ) : (
                        <button
                            onClick={handlerModal}
                            className="navbar__profile"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
                            >
                                <path d="M17.925 20.056a6 6 0 0 0-11.851.001" />
                                <circle cx="12" cy="11" r="4" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={handlerModal}
                        className="navbar__menu"
                        data-testid="navbar-menu-btn"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-menu-icon lucide-menu"
                        >
                            <path d="M4 5h16" />
                            <path d="M4 12h16" />
                            <path d="M4 19h16" />
                        </svg>
                    </button>
                    {openModal &&
                        positionModal &&
                        (user ? (
                            <ModalWrapper onClose={() => setOpenModal(false)}>
                                <ModalUserMenu
                                    onClose={() => setOpenModal(false)}
                                    position={positionModal}
                                />
                            </ModalWrapper>
                        ) : (
                            <ModalWrapper onClose={() => setOpenModal(false)}>
                                <ModalHomeMenu
                                    onClose={() => setOpenModal(false)}
                                    position={positionModal}
                                />
                            </ModalWrapper>
                        ))}
                </div>
            </div>
        </div>
    );
};
