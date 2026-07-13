import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        setupFiles: ['src/tests/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'tests/**/*.test.ts'],
        environment: 'jsdom',
        globals: true,
    },
});
