import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register } from '../../controllers/auth.ts';
import type { Request, Response, NextFunction } from 'express';
import { createUser } from '../../models/user.model.ts';
import bcrypt from 'bcrypt';

vi.mock('../../models/user.model.ts', () => ({
    createUser: vi.fn(),
}));

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn(),
    },
}));

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
        expect(register.length).toBe(3);
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
