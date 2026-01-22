const db = require('../../../config/database');

async function deleteNotificationToken(token) {
    const sql = 'DELETE FROM notifications WHERE token = ?';
    const values = [token];
    const [rows] = await db.execute(sql, values);
    return rows.affectedRows > 0;
}

module.exports = { deleteNotificationToken };
