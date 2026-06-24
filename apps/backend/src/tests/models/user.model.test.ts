import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser } from '../../models/user.model.ts';
import pool from '../../config/db.ts';

vi.mock('../../config/db.ts', () => ({
    default: {
        query: vi.fn().mockResolvedValue({
            rows: [
                {
                    id: 1,
                    email: 'test@example.com',
                    username: 'test',
                    role: ['user'],
                },
            ],
        }),
    },
}));

describe('createUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should have a function name createUser', () => {
        expect(typeof createUser).toBe('function');
    });

    it('should receive 3 arguments', () => {
        expect(createUser.length).toBe(3);
    });
    it('should insert a user and return the created user data', async () => {
        // 1. Données de test
        const email = 'test@example.com';
        const username = 'test';
        const password = 'hashed_password';

        const result = await createUser(email, username, password);

        expect(result).toEqual({
            id: 1,
            email: 'test@example.com',
            username: 'test',
            role: ['user'],
        });

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            [email, username, password]
        );
    });
});
