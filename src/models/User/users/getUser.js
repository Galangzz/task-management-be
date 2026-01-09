const db = require('../../../config/database');

async function getUserData(id) {
    const sql = 'SELECT username, email FROM users WHERE id = ?';
    const values = [id];
    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows[0] : null;
}

module.exports = { getUserData };
