import pool from '../config/db.ts';
import type { UserRecord, DBUser } from '../types/auth.types.ts';
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

// undefined because we manage this (user empty) in the controller.
export const getUserById = async (id: number): Promise<DBUser | undefined> => {
    const result = await pool.query<DBUser>(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );

    const user = result.rows[0];

    return user;
};
