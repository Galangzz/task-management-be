const db = require('../../../config/database');

const updateTaskModel = async (id, field, values) => {
    const sql = `UPDATE tasks
                SET ${field.join(', ')}
                WHERE id = ?`;
    const value = [...values, id];
    const [rows] = await db.execute(sql, value);

    return rows.affectedRows > 0 ? id : null;
};

module.exports = { updateTaskModel };
