const db = require('../../../config/database');

async function deleteTabById(id) {
    const sql = 'DELETE FROM task_tabs WHERE id = ?';
    const values = [id];
    const [rows] = await db.execute(sql, values);
    return rows.affectedRows > 0;
}

module.exports = { deleteTabById };
