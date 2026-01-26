const db = require('../../../config/database');
const NotFoundError = require('../../../exceptions/NotFoundError');
const { mapTabToModel, mapTaskTabsToModel, mapTaskToModel } = require('../../../utils');

const getTabById = async (id) => {
    const sql = 'SELECT * FROM task_tabs WHERE id = ?';
    const values = [id];
    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows[0] : null;
};

const getTabByIdMainTask = async (id, owner) => {
    const sql = `SELECT * FROM task_tabs WHERE delete_permission = 0 AND owner = ?`;
    const values = [owner];

    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows[0] : null;
};

// const getTaskTabWithTasks = async (id) => {
//     const sql = `
//             SELECT 
//                 tb.id,
//                 tb.name,
//                 tb.created_at,
//                 tb.delete_permission,
//                 t.id as task_id,
//                 t.title as task_title,
//                 t.detail as task_detail,
//                 t.created_at as task_created_at,
//                 t.deadline as task_deadline,
//                 t.has_date,
//                 t.has_time,
//                 t.starred,
//                 t.is_completed,
//                 t.task_tabs_id  
//             FROM task_tabs tb
//             LEFT JOIN tasks t ON tb.id = t.task_tabs_id
//             WHERE tb.id = ?
//         `;
//     const values = [id];
//     const [rows] = await db.execute(sql, values);

//     if (rows.length === 0) {
//         return null;
//     }

//     const result = mapTaskTabsToModel(rows);
//     return result;
// };
// const getMainTaskTab = async (ownerId) => {
//     const sql = `
//             SELECT
//                 tb.id,
//                 tb.name,
//                 tb.created_at,
//                 tb.delete_permission,
//                 t.id as task_id,
//                 t.title as task_title,
//                 t.detail as task_detail,
//                 t.created_at as task_created_at,
//                 t.deadline as task_deadline,
//                 t.has_date,
//                 t.has_time,
//                 t.starred,
//                 t.is_completed,
//                 t.task_tabs_id
//             FROM task_tabs tb
//             LEFT JOIN tasks t ON tb.id = t.task_tabs_id
//             WHERE tb.owner = ? AND delete_permission = 0
//         `;
//     const values = [ownerId];

//     const [rows] = await db.execute(sql, values);
//     if (!rows.length) {
//         throw new NotFoundError('Tab tidak ditemukan');
//     }

//     const result = mapTaskTabsToModel(rows);
//     return result;
// };

const getTabs = async (ownerId) => {
    const sql = 'SELECT id, name, created_at, delete_permission FROM task_tabs WHERE owner = ? ORDER BY created_at';
    const values = [ownerId];
    const [rows] = await db.execute(sql, values);
    return rows.map(mapTabToModel);
};

const getDeletePermissionTaskTabs = async (id) => {
    const sql = 'SELECT delete_permission AS permission FROM task_tabs WHERE id = ?';
    const values = [id];

    const [rows] = await db.execute(sql, values);

    return rows.length > 0 ? rows[0].permission : null;
};

const getStarredTaskTab = async (id) => {
    const sql = `SELECT tk.* FROM tasks tk 
            JOIN task_tabs tb ON tb.id = tk.task_tabs_id 
            WHERE tb.owner = ? AND tk.starred = 1 AND tk.is_completed = 0`;
    const values = [id];
    const [rows] = await db.execute(sql, values);
    return rows.map(mapTaskToModel);
};

const getTaskTabByName = async (name, ownerId) => {
    const sql = 'SELECT name FROM task_tabs WHERE name = ? AND owner = ?';
    const values = [name, ownerId];

    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows[0] : null;
};

module.exports = {
    getTabById,
    getTabByIdMainTask,
    // getTaskTabWithTasks,
    // getMainTaskTab,
    getTabs,
    getDeletePermissionTaskTabs,
    getStarredTaskTab,
    getTaskTabByName,
};
