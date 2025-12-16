const db = require('../config/database');
const { mapTaskTabsToModel, mapTaskToModel } = require('../utils/index');

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
    getTaskTabById: async (id) => {
        const sql = 'SELECT * FROM task_tabs WHERE id = ?';
        const values = [id];
        const [rows] = await db.execute(sql, values);
        return rows.length > 0 ? rows[0] : null;
    },
    getTaskTabWithTasks: async (id) => {
        const sql = `
            SELECT 
                tb.id,
                tb.name,
                tb.created_at,
                tb.delete_permission,
                t.id as task_id,
                t.title as task_title,
                t.detail as task_detail,
                t.created_at as task_created_at,
                t.deadline as task_deadline,
                t.has_date,
                t.has_time,
                t.starred,
                t.is_completed
            FROM task_tabs tb
            LEFT JOIN tasks t ON tb.id = t.task_tabs_id
            WHERE tb.id = ?
        `;
        const values = [id];
        const [rows] = await db.execute(sql, values);

        if (rows.length === 0) {
            return null;
        }

        const result = mapTaskTabsToModel(rows);
        return result;
    },
    getAllTaskTabs: async () => {
        const sql = 'SELECT * FROM task_tabs ORDER BY created_at';
        const [rows] = await db.execute(sql);
        return rows;
    },
    getDeletePermissionTaskTabs: async (id) => {
        const sql = 'SELECT delete_permission AS permission FROM task_tabs WHERE id = ?';
        const values = [id];

        const [rows] = await db.execute(sql, values);

        return rows.length > 0 ? rows[0].permission : null;
    },
    deleteTaskTab: async (id) => {
        const sql = 'DELETE FROM task_tabs WHERE id = ?';
        const values = [id];

        const [rows] = await db.execute(sql, values);

        return rows.affectedRows > 0;
    },
    getStarredTaskTab: async (id) => {
        const sql = 'SELECT * FROM tasks WHERE starred = 1 AND is_completed = 0';
        const [rows] = await db.query(sql);
        console.log({rows: rows[0]})
        return rows.map(mapTaskToModel);
    },
};

module.exports = TaskTabModel;
