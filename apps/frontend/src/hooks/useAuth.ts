import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
        );
    }

    return context;
}
