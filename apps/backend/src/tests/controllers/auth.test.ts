import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register, login, logout } from '../../controllers/auth.ts';
import type { Request, Response, NextFunction } from 'express';
import { createUser, getUserByEmail } from '../../models/user.model.ts';
import bcrypt from 'bcryptjs';
import ErrorResponse from '../../utils/errorResponse.ts';

vi.mock('../../models/user.model.ts', () => ({
    createUser: vi.fn(),
    getUserByEmail: vi.fn(),
}));

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

// -----------
// Register Route
// -----------

describe('Register Route', () => {
    let res: Response;
    let next: NextFunction;
    let req: Request;

    beforeEach(() => {
        vi.clearAllMocks();

        // RESPONSE
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        // NEXT
        next = vi.fn() as NextFunction;

        // BCRYPT
        //vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password_123');
        (bcrypt.hash as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
            'hashed_password_123'
        );

        // Request
        req = {
            body: {
                email: 'mathilda@example.com',
                username: 'mathilda',
                password: 'jupiter',
            },
        } as unknown as Request;
    });

    it('should be a function', () => {
        expect(typeof register).toBe('function');
    });
    it('should take 3 arguments', () => {
        expect(register).toHaveLength(3);
    });
    it('should return a status code 201 with success', async () => {
        vi.mocked(createUser).mockResolvedValue({
            id: 1,
            username: 'mathilda',
            email: 'mathilda@example.com',
            role: ['user'],
        });

        await register(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 1,
                username: 'mathilda',
                email: 'mathilda@example.com',
                role: ['user'],
            },
        });
        expect(createUser).toHaveBeenCalledOnce();
    });
    it('should return a status code 409 with Error (duplication)', async () => {
        vi.mocked(createUser).mockRejectedValue(
            Object.assign(
                new Error('duplicate key value violates unique constraint'),
                {
                    code: '23505',
                }
            )
        );

        await register(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 409,
                message: 'Account already exists',
            })
        );
        expect(createUser).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
    });
    it('should send a password hashed to the DB', async () => {
        vi.mocked(createUser).mockResolvedValue({
            id: 1,
            username: 'mathilda',
            email: 'mathilda@example.com',
            role: ['user'],
        });

        await register(req, res, next);

        expect(createUser).toHaveBeenCalledWith(
            'mathilda@example.com',
            'mathilda',
            'hashed_password_123'
        );
    });
});

// -----------
// Login Route
// -----------

describe('Login Route', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();

        // RESPONSE
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        // NEXT
        next = vi.fn() as NextFunction;

        // BCRYPT
        (
            bcrypt.compare as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValue(true);

        // Request
        req = {
            body: {
                email: 'alice@example.com',
                username: 'alice',
                password: 'myPassword',
            },
            session: {},
        } as unknown as Request;
    });
    it('should be a function', () => {
        expect(typeof login).toBe('function');
    });
    it('should take 3 arguments', () => {
        expect(login).toHaveLength(3);
    });
    it('should return user Info when with success login', async () => {
        vi.mocked(getUserByEmail).mockResolvedValue({
            id: 122,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: 'SuperHash',
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(getUserByEmail).toHaveBeenCalledOnce();
        expect(bcrypt.compare).toHaveBeenCalledOnce();
    });
    it('should call next with an ErrorResponse 401 when user is not found', async () => {
        vi.mocked(getUserByEmail).mockRejectedValue(
            new ErrorResponse('email or password is incorrect', 401)
        );

        await login(req, res, next);

        expect(getUserByEmail).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(
            new ErrorResponse('email or password is incorrect', 401)
        );
    });
    it('should call next with an ErrorResponse 401 when password is incorrect', async () => {
        vi.mocked(getUserByEmail).mockResolvedValue({
            id: 122,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: 'MyOtherPassword',
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });
        (
            bcrypt.compare as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValue(false);

        await login(req, res, next);

        expect(getUserByEmail).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
        expect(bcrypt.compare).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(
            new ErrorResponse('email or password is incorrect', 401)
        );
    });
    it('should call next with an unexpected error when an error is thrown', async () => {
        vi.mocked(getUserByEmail).mockRejectedValue(
            new Error('Unexpected error')
        );

        await login(req, res, next);

        expect(getUserByEmail).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(new Error('Unexpected error'));
    });
});

// -----------
// Logout Route
// -----------
describe('logout route', () => {
    let res: Response;
    let next: NextFunction;
    let req: Request;

    beforeEach(() => {
        vi.clearAllMocks();

        // REQUEST
        req = {
            session: {},
        } as unknown as Request;

        // RESPONSE
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            clearCookie: vi.fn(),
        } as unknown as Response;

        // NEXT
        next = vi.fn() as NextFunction;
    });

    it('should be a function', () => {
        expect(typeof logout).toBe('function');
    });
    it('should take 3 arguments', () => {
        expect(logout).toHaveLength(3);
    });
    it('should return 401 status if userId is not in session', () => {
        logout(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Unauthorized!!',
                statusCode: 401,
            })
        );
    });
    it('should logout the user and destroy the session', () => {
        const req = {
            session: {
                userId: 122,
                destroy: vi.fn((cb: (err?: Error) => void) => {
                    cb();
                }),
            },
        } as unknown as Request;

        logout(req, res, next);

        expect(res.status).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.clearCookie).toHaveBeenCalledOnce();
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: 'Logout user',
            })
        );
    });
    it('should call next if destroy fails', () => {
        const req = {
            session: {
                userId: 122,
                destroy: vi.fn((cb: (err?: Error) => void) => {
                    cb(new Error('destroy failed'));
                }),
            },
        } as unknown as Request;

        logout(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
