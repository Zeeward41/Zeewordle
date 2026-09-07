import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createUser,
    getUserByEmail,
    getUserById,
    deleteUserById,
    getUserByGoogleId,
    linkGoogleAccount,
    findUserByEmail,
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

    it('should receive 2 arguments', () => {
        expect(createUser).toHaveLength(2);
    });
    it('should insert a user and return the created user data', async () => {
        const email = 'test@example.com';
        const username = 'test';
        const password = 'hashed_password';
        const google_id = null;

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
                    has_password: true,
                },
            ],
        } as unknown as QueryResult);

        const result = await createUser(email, username, password, google_id);

        expect(result).toEqual({
            id: 1,
            email: 'test@example.com',
            username: 'test',
            role: ['user'],
            has_password: true,
        });

        //pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            [email, username, password, google_id]
        );
    });
    it('should return an Error when trying to add a duplicate user', async () => {
        const email = 'test@example.com';
        const username = 'test';
        const password = 'hashed_password';
        const google_id = null;

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );
        mockQuery.mockRejectedValue({
            code: '23505',
            detail: 'Key (email)=(jean.dupont@email.com) already exists.',
            constraint: 'users_email_key',
        });

        await expect(
            createUser(email, username, password, google_id)
        ).rejects.toMatchObject({
            code: '23505',
            constraint: 'users_email_key',
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            [email, username, password, google_id]
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
        expect(getUserByEmail).toHaveLength(1);
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

describe('getUserById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should have a function name getUserById', () => {
        expect(typeof getUserById).toBe('function');
    });

    it('should receive 1 arguments', () => {
        expect(getUserById).toHaveLength(1);
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

// --------------
// deleteUserById
// --------------

describe('deleteUserById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should have a function name deleteUserById', () => {
        expect(typeof deleteUserById).toBe('function');
    });

    it('should receive 1 arguments', () => {
        expect(deleteUserById).toHaveLength(1);
    });
    it('should return a user when a valid user is deleted', async () => {
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

        const result = await deleteUserById(id);

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
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [id]
        );
    });
});

// --------------
// getUserByGoogleId
// --------------

describe('getUserByGoogleId', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have a function name getUserByGoogleId', () => {
        expect(typeof getUserByGoogleId).toBe('function');
    });

    it('should receive 1 argument', () => {
        expect(getUserByGoogleId).toHaveLength(1);
    });

    it('should return a user when a valid google id is provided', async () => {
        const googleId = 'google-123456';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 32,
                    email: 'alice@mail.com',
                    username: 'alice',
                    password_hash: null,
                    google_id: googleId,
                    role: ['user'],
                    created_at: new Date('2026-07-01T15:13:00.077Z'),
                },
            ],
        } as unknown as QueryResult);

        const result = await getUserByGoogleId(googleId);

        expect(result).toEqual({
            id: 32,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: null,
            google_id: googleId,
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        // pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE google_id = $1',
            [googleId]
        );
    });

    it('should return undefined when user is not found', async () => {
        const googleId = 'google-unknown';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [],
        } as unknown as QueryResult);

        const result = await getUserByGoogleId(googleId);

        expect(result).toBeUndefined();

        // pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE google_id = $1',
            [googleId]
        );
    });
});

// --------------
// linkGoogleAccount
// --------------
//
describe('linkGoogleAccount', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have a function name linkGoogleAccount', () => {
        expect(typeof linkGoogleAccount).toBe('function');
    });

    it('should receive 2 arguments', () => {
        expect(linkGoogleAccount).toHaveLength(2);
    });

    it('should link a Google account and return the updated user', async () => {
        const userId = 32;
        const googleId = 'google-123456';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [
                {
                    id: 32,
                    email: 'alice@mail.com',
                    username: 'alice',
                    password_hash: null,
                    google_id: googleId,
                    role: ['user'],
                    created_at: new Date('2026-07-01T15:13:00.077Z'),
                },
            ],
        } as unknown as QueryResult);

        const result = await linkGoogleAccount(userId, googleId);

        expect(result).toEqual({
            id: 32,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: null,
            google_id: googleId,
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        // pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE users'),
            [userId, googleId]
        );
    });

    it('should throw an ErrorResponse 400 when user is not found', async () => {
        const userId = 32;
        const googleId = 'google-123456';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [],
        } as unknown as QueryResult);

        await expect(linkGoogleAccount(userId, googleId)).rejects.toEqual(
            expect.objectContaining({
                message: 'Failed to link Google account',
                statusCode: 400,
            })
        );

        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE users'),
            [userId, googleId]
        );
    });

    it('should propagate database errors', async () => {
        const userId = 32;
        const googleId = 'google-123456';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        const databaseError = new Error('Database connection error');

        mockQuery.mockRejectedValue(databaseError);

        await expect(linkGoogleAccount(userId, googleId)).rejects.toThrow(
            'Database connection error'
        );

        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE users'),
            [userId, googleId]
        );
    });
});

// --------------
// findUserByEmail
// --------------

describe('findUserByEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have a function name findUserByEmail', () => {
        expect(typeof findUserByEmail).toBe('function');
    });

    it('should receive 1 argument', () => {
        expect(findUserByEmail).toHaveLength(1);
    });

    it('should return a user when a valid email is provided', async () => {
        const email = 'alice@mail.com';

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
                    google_id: null,
                    role: ['user'],
                    created_at: new Date('2026-07-01T15:13:00.077Z'),
                },
            ],
        } as unknown as QueryResult);

        const result = await findUserByEmail(email);

        expect(result).toEqual({
            id: 32,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: 'SuperHash',
            google_id: null,
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        // pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
    });

    it('should return undefined when user is not found', async () => {
        const email = 'unknown@mail.com';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        mockQuery.mockResolvedValue({
            rows: [],
        } as unknown as QueryResult);

        const result = await findUserByEmail(email);

        expect(result).toBeUndefined();

        // pool.query must be bound to its object to avoid unintentional `this` scoping (unbound-method)
        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
    });

    it('should propagate database errors', async () => {
        const email = 'alice@mail.com';

        const mockQuery = vi.mocked(
            pool.query as unknown as () => Promise<QueryResult>
        );

        const databaseError = new Error('Database connection error');

        mockQuery.mockRejectedValue(databaseError);

        await expect(findUserByEmail(email)).rejects.toThrow(
            'Database connection error'
        );

        expect(mockQuery).toHaveBeenCalledOnce();
        expect(mockQuery).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
    });
});
