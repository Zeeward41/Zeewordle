import './MainLayout.css';
import { Navbar } from '../components/Navbar/Navbar.tsx';
import { Outlet } from '@tanstack/react-router';

export const MainLayout = () => {
    return (
        <div className="mainlayout">
            <Navbar />
            <div className="mainlayout__content">
                <Outlet />
            </div>
        </div>
    );
};
