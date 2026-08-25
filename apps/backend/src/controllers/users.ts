import type { Request, Response, NextFunction } from 'express';
import { getUserById, deleteUserById } from '../models/user.model.ts';
import type { UserRecord } from '../types/auth.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';

import {
    zeewordle_profile_db_lookup_duration_seconds,
    zeewordle_profile_dependency_failures_total,
    zeewordle_profile_duration_seconds,
    zeewordle_profile_not_found_total,
    zeewordle_profile_success_total,
    zeewordle_profile_unauthorized_total,
    zeewordle_delete_account_db_delete_duration_seconds,
    zeewordle_delete_account_db_lookup_duration_seconds,
    zeewordle_delete_account_dependency_failures_total,
    zeewordle_delete_account_duration_seconds,
    zeewordle_delete_account_not_found_total,
    zeewordle_delete_account_success_total,
    zeewordle_delete_account_unauthorized_total,
} from '../metrics/users.metrics.ts';

// @desc        profile User
// @route       GET /api/v1/users/profile
// @access      Private
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const endProfileTimer = zeewordle_profile_duration_seconds.startTimer();
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }
        let result;
        const endLookupTimer =
            zeewordle_profile_db_lookup_duration_seconds.startTimer();
        try {
            result = await getUserById(userId);
        } finally {
            endLookupTimer();
        }
        if (!result) {
            throw new ErrorResponse('This id does not exist !!', 401);
        }
        const user: UserRecord = {
            id: result.id,
            email: result.email,
            username: result.username,
            role: result.role,
        };
        zeewordle_profile_success_total.inc();
        endProfileTimer({ status: '200', reason: 'success' });
        res.status(200).json({ user });
    } catch (err) {
        if (err instanceof ErrorResponse) {
            if (err.statusCode === 401 && err.message === 'Unauthorized!!') {
                endProfileTimer({ status: '401', reason: 'unauthorized' });
                zeewordle_profile_unauthorized_total.inc();
            } else if (
                err.statusCode === 401 &&
                err.message === 'This id does not exist !!'
            ) {
                endProfileTimer({ status: '401', reason: 'not_found' });
                zeewordle_profile_not_found_total.inc();
            }
        } else {
            endProfileTimer({ status: 500, reason: 'failure' });
            zeewordle_profile_dependency_failures_total.inc();
        }
        next(err);
    }
};

// @desc        Delete User
// @route       DELETE /api/v1/users
// @access      Private
export const deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const endRouteTimer =
        zeewordle_delete_account_duration_seconds.startTimer();
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }
        const endLookupTimer =
            zeewordle_delete_account_db_lookup_duration_seconds.startTimer();
        let check;
        try {
            check = await getUserById(userId);
        } finally {
            endLookupTimer();
        }
        if (!check) {
            throw new ErrorResponse('This id does not exist !!', 401);
        }
        const endDeleteTimer =
            zeewordle_delete_account_db_delete_duration_seconds.startTimer();
        try {
            await deleteUserById(userId);
        } finally {
            endDeleteTimer();
        }

        req.session.destroy(err => {
            if (err) {
                next(new ErrorResponse('session_destroy_failed', 500));
                return;
            }

            zeewordle_delete_account_success_total.inc();
            endRouteTimer({ status: '200', reason: 'Success' });
            res.clearCookie('connect.sid');
            res.status(200).json({ data: 'User deleted' });
        });
    } catch (err) {
        if (err instanceof ErrorResponse) {
            if (err.statusCode === 401 && err.message === 'Unauthorized!!') {
                endRouteTimer({ status: '401', reason: 'unauthorized' });
                zeewordle_delete_account_unauthorized_total.inc();
            } else if (
                err.statusCode === 401 &&
                err.message === 'This id does not exist !!'
            ) {
                endRouteTimer({ status: '401', reason: 'user_not_found' });
                zeewordle_delete_account_not_found_total.inc();
            } else if (
                err.statusCode === 500 &&
                err.message === 'session_destroy_failed'
            ) {
                endRouteTimer({
                    status: '500',
                    reason: 'session_destroy_failed',
                });
                zeewordle_delete_account_dependency_failures_total.inc();
            }
        } else {
            endRouteTimer({ status: '500', reason: 'db_failure' });
            zeewordle_delete_account_dependency_failures_total.inc();
        }
        next(err);
    }
};
