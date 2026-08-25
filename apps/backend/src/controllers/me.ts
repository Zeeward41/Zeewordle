import type { Request, Response, NextFunction } from 'express';
import { getUserById } from '../models/user.model.ts';
import type { UserRecord } from '../types/auth.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';

import {
    zeewordle_me_success_total,
    zeewordle_me_unauthorized_total,
    zeewordle_me_not_found_total,
    zeewordle_me_dependency_failures_total,
    zeewordle_me_db_lookup_duration_seconds,
    zeewordle_me_duration_seconds,
} from '../metrics/me.metrics.ts';

// @desc        Me User
// @route       GET /api/v1/me
// @access      Private
export const me = async (req: Request, res: Response, next: NextFunction) => {
    const endRouteTimer = zeewordle_me_duration_seconds.startTimer();
    try {
        const userId = req.session.userId;
        if (!userId) {
            throw new ErrorResponse('Unauthorized!!', 401);
        }
        let result;
        const endDbTimer = zeewordle_me_db_lookup_duration_seconds.startTimer();
        try {
            result = await getUserById(userId);
        } finally {
            endDbTimer();
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
        endRouteTimer({ status: 200, reason: 'success' });
        zeewordle_me_success_total.inc();
        res.status(200).json(user);
    } catch (err) {
        // Handle metrics centrally since custom errors bubble up here
        if (err instanceof ErrorResponse) {
            if (err.statusCode === 401 && err.message === 'Unauthorized!!') {
                endRouteTimer({ status: '401', reason: 'unauthorized' });
                zeewordle_me_unauthorized_total.inc();
            } else if (
                err.statusCode === 401 &&
                err.message === 'This id does not exist !!'
            ) {
                endRouteTimer({ status: '401', reason: 'not_found' });
                zeewordle_me_not_found_total.inc();
            }
        } else {
            endRouteTimer({ status: '500', reason: 'db_failure' });
            zeewordle_me_dependency_failures_total.inc();
        }

        next(err);
    }
};
