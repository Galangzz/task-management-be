const { nanoid } = require('nanoid');
const db = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');

const addRefreshToken = async (userId, token) => {
    const id = `auth-${nanoid(16)}`;
    const sql = 'INSERT INTO authentications(id, user_id, token) VALUES(?, ?, ?)';
    const values = [id, userId, token];

    await db.execute(sql, values);
};

const verifyRefreshToken = async (token) => {
    const sql = 'SELECT token FROM authentications WHERE token = ?';
    const values = [token];

    const [rows] = await db.execute(sql, values);

    if (!rows.length) {
        throw new InvariantError('RefreshToken tidak valid');
    }
};

const deleteRefreshToken = async (token) => {
    const sql = 'DELETE FROM authentications WHERE token = ?';
    const values = [token];

    await db.execute(sql, values);
};

module.exports = {
    addRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken,
};
