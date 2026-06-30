import pool from '../config/db.ts';
import type { UserRecord } from '../types/auth.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';

export const createUser = async (
    email: string,
    username: string,
    password_hash: string
): Promise<UserRecord> => {
    const result = await pool.query<UserRecord>(
        `INSERT INTO users (email, username, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, username, role`,
        [email, username, password_hash]
    );
    const user = result.rows[0];
    if (!user) throw new ErrorResponse('User creation failed', 400);
    return user;
};
