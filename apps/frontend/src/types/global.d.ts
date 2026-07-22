export {};

declare global {
    interface Window {
        _env_?: {
            VITE_API_URL?: string;
            [key: string]: string | undefined;
        };
    }
}
