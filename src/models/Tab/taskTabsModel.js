// const db = require('../../config/database');
// const AuthorizationError = require('../../exceptions/AuthorizationError');
// const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');
// const { mapTaskTabsToModel, mapTaskToModel, mapTabToModel } = require('../../utils/index');

//     addMainTask: async (id, owner) => {
//         const sql = `INSERT INTO task_tabs(id, name, delete_permission, owner)
//                     VALUES(?, ?, ?, ?)`;
//         const values = [id, 'Tugas Saya', false, owner];

//         const [rows] = await db.execute(sql, values);
//         if (rows.affectedRows === 0) {
//             throw new InvariantError('Gagal menambahkan tab awal');
//         }
//     },
//     addTaskTab: async (id, name, ownerId) => {
//         const sql = 'INSERT INTO task_tabs(id, name, owner) VALUES(?, ?, ?)';
//         const values = [id, name, ownerId];

//         const [rows] = await db.execute(sql, values);
//         return rows.affectedRows > 0;
//     },
//     getTaskTabByName: async (name, ownerId) => {
//         const sql = 'SELECT name FROM task_tabs WHERE name = ? AND owner = ?';
//         const values = [name, ownerId];

//         const [rows] = await db.execute(sql, values);
//         return rows.length > 0 ? rows[0] : null;
//     },
//     getTabById: async (id) => {
//         const sql = 'SELECT * FROM task_tabs WHERE id = ?';
//         const values = [id];
//         const [rows] = await db.execute(sql, values);
//         return rows.length > 0 ? rows[0] : null;
//     },
//     getTabByIdMainTask: async (id, owner) => {
//         const sql = `SELECT * FROM task_tabs WHERE delete_permission = 0 AND owner = ?`;
//         const values = [owner];

//         const [rows] = await db.execute(sql, values);
//         return rows.length > 0 ? rows[0] : null;
//     },
//     getTaskTabWithTasks: async (id) => {
//         const sql = `
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
//         const values = [id];
//         const [rows] = await db.execute(sql, values);

//         if (rows.length === 0) {
//             return null;
//         }

//         const result = mapTaskTabsToModel(rows);
//         return result;
//     },
//     getMainTaskTab: async (ownerId) => {
//         const sql = `
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
//         const values = [ownerId];

//         const [rows] = await db.execute(sql, values);
//         if (!rows.length) {
//             throw new NotFoundError('Tab tidak ditemukan');
//         }

//         const result = mapTaskTabsToModel(rows);
//         return result;
//     },
//     getTabs: async (ownerId) => {
//         const sql = 'SELECT id, name, created_at, delete_permission FROM task_tabs WHERE owner = ? ORDER BY created_at';
//         const values = [ownerId];
//         const [rows] = await db.execute(sql, values);
//         return rows.map(mapTabToModel);
//     },
//     getDeletePermissionTaskTabs: async (id) => {
//         const sql = 'SELECT delete_permission AS permission FROM task_tabs WHERE id = ?';
//         const values = [id];

//         const [rows] = await db.execute(sql, values);

//         return rows.length > 0 ? rows[0].permission : null;
//     },
//     deleteTabById: async (id) => {
//         const sql = 'DELETE FROM task_tabs WHERE id = ?';
//         const values = [id];

//         const [rows] = await db.execute(sql, values);

//         return rows.affectedRows > 0;
//     },
//     getStarredTaskTab: async (id) => {
//         const sql = `SELECT tk.* FROM tasks tk
//             JOIN task_tabs tb ON tb.id = tk.task_tabs_id
//             WHERE tb.owner = ? AND tk.starred = 1 AND tk.is_completed = 0`;
//         const values = [id];
//         const [rows] = await db.execute(sql, values);
//         console.log({ rows: rows[0] });
//         return rows.map(mapTaskToModel);
//     },
//     verifyTabOwner: async (id, owner) => {
//         const sql = `SELECT tb.owner
//             FROM task_tabs tb
//             JOIN users u ON tb.owner = u.id
//             WHERE tb.id = ?`;
//         const values = [id];

//         const [rows] = await db.execute(sql, values);
//         if (!rows.length) {
//             throw new NotFoundError('Tab tidak ditemukan');
//         }

//         const tab = rows[0];
//         if (tab.owner !== owner) {
//             throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
//         }
//     },
