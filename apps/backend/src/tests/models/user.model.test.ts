import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createUser,
    getUserByEmail,
    getUserById,
} from '../../models/user.model.ts';
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

        const result = await createUser(email, username, password);

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

// --------------
// getUserByEmail
// --------------

describe('getUserByEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should have a function name getUserById', () => {
        expect(typeof getUserByEmail).toBe('function');
    });

    it('should receive 1 arguments', () => {
        expect(getUserByEmail.length).toBe(1);
    });
    it('should get the user Data', async () => {
        const email = 'alice@mail.com';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    email: 'alice@mail.com',
                    username: 'alice',
                    password_hash: 'SuperHash',
                    role: ['user'],
                    created_at: new Date('2026-07-01T15:13:00.077Z'),
                },
            ],
        } as unknown as QueryResult);

        const result = await getUserByEmail(email);

        expect(result).toEqual({
            id: 1,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: 'SuperHash',
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        //pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
    });
    it('should throw an ErrorResponse 401 when user is not found', async () => {
        const email = 'alice@mail.com';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [],
        } as unknown as QueryResult);

        await expect(getUserByEmail('alice@mail.com')).rejects.toEqual(
            expect.objectContaining({
                message: 'email or password is incorrect',
                statusCode: 401,
            })
        );
        //pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
    });
});

// --------------
// getUserById
// --------------

describe(getUserById, () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should have a function name getUserById', () => {
        expect(typeof getUserById).toBe('function');
    });

    it('should receive 1 arguments', () => {
        expect(getUserById.length).toBe(1);
    });
    it('should return a user when a valid id is provided', async () => {
        const id = 32;

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 32,
                    email: 'alice@mail.com',
                    username: 'alice',
                    password_hash: 'SuperHash',
                    role: ['user'],
                    created_at: new Date('2026-07-01T15:13:00.077Z'),
                },
            ],
        } as unknown as QueryResult);

        const result = await getUserById(id);

        expect(result).toEqual({
            id: 32,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: 'SuperHash',
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        //pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
    });
});
