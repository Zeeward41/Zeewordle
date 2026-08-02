import { getProfile } from '../../controllers/users.ts';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { getUserById } from '../../models/user.model.ts';

vi.mock('../../models/user.model.ts', () => ({
    getUserById: vi.fn(),
}));

describe('getProfile route', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            session: {
                userId: 122,
            },
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        next = vi.fn();
    });
    it('should have a function getProfile', () => {
        expect(typeof getProfile).toBe('function');
    });
    it('should take 3 argument', () => {
        expect(getProfile).toHaveLength(3);
    });
    it('should return the authenticated user profile details', async () => {
        vi.mocked(getUserById).mockResolvedValue({
            id: 122,
            email: 'alice@mail.com',
            username: 'alice',
            password_hash: 'superhash',
            role: ['user'],
            created_at: new Date('2026-07-01T15:13:00.077Z'),
        });

        await getProfile(req, res, next);
        expect(getUserById).toHaveBeenCalledOnce();
        expect(getUserById).toHaveBeenCalledWith(122);
        expect(res.status).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledOnce();
        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: 122,
                email: 'alice@mail.com',
                username: 'alice',
                role: ['user'],
            },
        });
    });
    it('should return a 401 status if the ID does not exist', async () => {
        vi.mocked(getUserById).mockResolvedValue(undefined);

        await getProfile(req, res, next);

        expect(getUserById).toHaveBeenCalledOnce();
        expect(getUserById).toHaveBeenCalledWith(122);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'This id does not exist !!',
                statusCode: 401,
            })
        );
    });
    it('should return a 401 status if userId is not in session', async () => {
        req = {
            session: {},
        } as unknown as Request;
        await getProfile(req, res, next);

        expect(getUserById).not.toHaveBeenCalledOnce();
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
});
