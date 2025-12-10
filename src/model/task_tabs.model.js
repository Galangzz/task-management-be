const db = require('../config/database');

const TaskTabModel = {
    addTaskTab: async (id, name) => {
        const sql = 'INSERT INTO task_tabs(id, name) VALUES(?, ?)';
        const values = [id, name];

        const [rows] = await db.execute(sql, values);
        return rows.affectedRows > 0;
    },
    getTaskTabByName: async (name) => {
        const sql = 'SELECT name FROM task_tabs WHERE name = ?';
        const values = [name];

        const [rows] = await db.execute(sql, values);
        return rows.length > 0 ? rows[0] : null;
    },
};

module.exports = TaskTabModel;
