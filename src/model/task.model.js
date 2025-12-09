const db = require('../config/database');

const TaskModel = {
    getAllTasks: async (id) => {
        const sql = `SELECT * FROM tasks WHERE task_tabs_id = ?`;
        const values = [id];

        const [rows] = await db.execute(sql, values);
        return rows;
    },
};

module.exports = TaskModel;
