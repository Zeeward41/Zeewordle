import pool from '../config/db.ts';
import type { UserRecord, DBUser } from '../types/auth.types.ts';
import ErrorResponse from '../utils/errorResponse.ts';

export const createUser = async (
    email: string,
    username: string,
    password_hash: string | null = null,
    google_id: string | null = null
): Promise<UserRecord> => {
    const result = await pool.query<UserRecord>(
        `INSERT INTO users (email, username, password_hash, google_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, username, role`,
        [email, username, password_hash, google_id]
    );
    const user = result.rows[0];
    if (!user) throw new ErrorResponse('User creation failed', 400);
    return user;
};

export const getUserByGoogleId = async (
    googleId: string
): Promise<DBUser | undefined> => {
    const result = await pool.query<DBUser>(
        `SELECT * FROM users WHERE google_id = $1`,
        [googleId]
    );
    return result.rows[0];
};

export const linkGoogleAccount = async (
    userId: number,
    googleId: string
): Promise<DBUser> => {
    const result = await pool.query<DBUser>(
        `UPDATE users 
         SET google_id = $2 
         WHERE id = $1 
         RETURNING *`,
        [userId, googleId]
    );
    const user = result.rows[0];
    if (!user) throw new ErrorResponse('Failed to link Google account', 400);
    return user;
};

export const getUserByEmail = async (email: string): Promise<DBUser> => {
    const result = await pool.query<DBUser>(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    const user = result.rows[0];
    if (!user) {
        throw new ErrorResponse('email or password is incorrect', 401);
    }

    return user;
};

export const findUserByEmail = async (
    email: string
): Promise<DBUser | undefined> => {
    const result = await pool.query<DBUser>(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};

export const getUserById = async (id: number): Promise<DBUser | undefined> => {
    const result = await pool.query<DBUser>(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );

    const user = result.rows[0];

    return user;
};

export const deleteUserById = async (
    id: number
): Promise<DBUser | undefined> => {
    const result = await pool.query<DBUser>(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [id]
    );

    const user = result.rows[0];

    return user;
};
