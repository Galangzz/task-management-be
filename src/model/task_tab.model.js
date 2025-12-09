const db = require('../config/database');
const { nanoid } = require('nanoid');

const TaskTabModel = {
    addTaskTab: async (name) => {
        const id = `tab-${nanoid(16)}`;
        const sql = 'INSERT INTO task_tabs(id, name) VALUES(?, ?)';
        const values = [id, name];

        const [rows] = await db.execute(sql, values);
        return rows.affectedRows > 0;
    },
};

module.exports = TaskTabModel;
