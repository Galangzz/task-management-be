const db = require('../../../config/database');
const { toMySQLDateTime, mapTaskToModel } = require('../../../utils');

const addTaskModel = async (id, { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId }) => {
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
    const values = [id, title, detail, toMySQLDateTime(deadline), hasDate, hasTime, starred, isCompleted, taskTabId];

    await db.execute(sql, values);

    const [rows] = await db.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);

    return rows.map(mapTaskToModel)[0];
};

module.exports = { addTaskModel };
