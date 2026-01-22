const db = require('../../../config/database');

async function addNotificationToken(id, userId, token) {
    const sql = `
        INSERT INTO notifications(id, user_id, token) 
        VALUES(?, ?, ?)
        ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        last_updated = CURRENT_TIMESTAMP
        `;
    const values = [id, userId, token];
    const [rows] = await db.execute(sql, values);
    if (rows.affectedRows === 1) {
        return { status: 201, message: 'Token berhasil disimpan' };
    }

    return { status: 200, message: 'Token berhasil diperbaharui' };
}

module.exports = { addNotificationToken };
