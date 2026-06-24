import pool from '../config/db.ts';

export const createUser = async (
    email: string,
    username: string,
    password_hash: string
) => {
    const result = await pool.query(
        `INSERT INTO users (email, username, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, username, role`,
        [email, username, password_hash]
    );
    return result.rows[0];
};
