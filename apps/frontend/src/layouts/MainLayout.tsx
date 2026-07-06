import './MainLayout.css';
import { Navbar } from '../components/Navbar/Navbar.tsx';
import { Outlet } from '@tanstack/react-router';

export const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};
