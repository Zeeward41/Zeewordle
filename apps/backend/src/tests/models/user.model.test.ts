import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUser } from '../../models/user.model.ts';
import pool from '../../config/db.ts';
import type { QueryResult } from 'pg';

vi.mock('../../config/db.ts');

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
        const email = 'test@example.com';
        const username = 'test';
        const password = 'hashed_password';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    email: 'test@example.com',
                    username: 'test',
                    role: ['user'],
                },
            ],
        } as unknown as QueryResult);

        const result = (await createUser(
            email,
            username,
            password
        )) as QueryResult;

        expect(result).toEqual({
            id: 1,
            email: 'test@example.com',
            username: 'test',
            role: ['user'],
        });

        //pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            [email, username, password]
        );
    });
    it('should return an Error when trying to add a duplicate user', async () => {
        const email = 'test@example.com';
        const username = 'test';
        const password = 'hashed_password';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );
        mockQuery.mockRejectedValue({
            code: '23505',
            detail: 'Key (email)=(jean.dupont@email.com) already exists.',
            constraint: 'users_email_key',
        });

        await expect(
            createUser(email, username, password)
        ).rejects.toMatchObject({
            code: '23505',
            constraint: 'users_email_key',
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            [email, username, password]
        );
    });
});
