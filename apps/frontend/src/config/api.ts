//const API_URL = import.meta.env['VITE_API_URL'] as string;
const API_URL = import.meta.env.DEV
    ? (import.meta.env['VITE_API_URL'] as string)
    : (window._env_?.VITE_API_URL ?? '');

export const API_ROUTES = {
    me: `${API_URL}/api/v1/me`,
    login: `${API_URL}/api/v1/auth/login`,
    logout: `${API_URL}/api/v1/auth/logout`,
    register: `${API_URL}/api/v1/auth/register`,
};
