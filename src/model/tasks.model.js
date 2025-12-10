const db = require('../config/database');
const { toMySQLDateTime } = require('../utils');

const TaskModel = {
    getTaskById: async (id) => {
        const sql = `SELECT * FROM tasks WHERE task_tabs_id = ?`;
        const values = [id];

        const [rows] = await db.execute(sql, values);
        return rows.length > 0 ? rows[0] : null;
    },
    addTask: async (id, { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId }) => {
        const sql = `INSERT INTO tasks(
            id,
            title,
            detail, 
            deadline,
            has_date,
            has_time,
            starred,
            is_completed,
            task_tabs_id 
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            id,
            title,
            detail,
            toMySQLDateTime(deadline),
            hasDate,
            hasTime,
            starred,
            isCompleted,
            taskTabId,
        ];

        await db.execute(sql, values);

        const [rows] = await db.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);

        return rows[0];
    },
};

module.exports = TaskModel;
