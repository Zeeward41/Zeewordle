export {};

declare global {
    interface Window {
        _env_?: {
            VITE_API_URL?: string;
            VITE_GOOGLE_CLIENT_ID?: string;
            [key: string]: string | undefined;
        };
    }
}
