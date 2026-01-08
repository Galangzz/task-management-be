const db = require('../../../config/database');

const deleteTaskById = async (taskId) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const values = [taskId];

    const [rows] = await db.execute(sql, values);
    return rows.affectedRows > 0;
};

module.exports = {
    deleteTaskById,
};
