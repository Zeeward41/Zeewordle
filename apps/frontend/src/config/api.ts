const API_URL = import.meta.env['VITE_API_URL'] as string;

export const API_ROUTES = {
    me: `${API_URL}/api/v1/auth/me`,
    login: `${API_URL}/api/v1/auth/login`,
    logout: `${API_URL}/api/v1/auth/logout`,
};
