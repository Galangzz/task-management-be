const db = require('../../../config/database');
const NotFoundError = require('../../../exceptions/NotFoundError');
const { mapTaskToModel, mapDeadlineToModel } = require('../../../utils');

const getTasksByIdTab = async (id) => {
    const sql = `SELECT * FROM tasks WHERE task_tabs_id = ?`;
    const values = [id];

    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows.map(mapTaskToModel) : null;
};

const getTaskById = async (id) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const values = [id];

    const [rows] = await db.execute(sql, values);
    if (!rows.length) {
        throw new NotFoundError('Tugas tidak ditemukan');
    }

    return rows.map(mapTaskToModel)[0];
};

const getTaskStarred = async (id) => {
    const sql = `SELECT tk.* FROM tasks tk 
            JOIN task_tabs tb ON tb.id = tk.task_tabs_id 
            WHERE tb.owner = ? AND tk.starred = 1 AND tk.is_completed = 0`;
    const values = [id];
    const [rows] = await db.execute(sql, values);
    return rows.length > 0 ? rows.map(mapTaskToModel) : null;
};

const getTaskDeadlined = async () => {
    //TODO: FIX THIS: Add New Column to flag sent reminder
    // const sql = `
    //     SELECT tk.title, tk.deadline, tb.owner FROM tasks tk
    //     JOIN task_tabs tb ON tk.task_tabs_id = tb.id
    //     WHERE is_completed = 0 
    //         AND tk.deadline BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 5 MINUTE)
    //         AND NOT EXISTS (
    //             SELECT 1 
    //             FROM notifications tn 
    //             WHERE tn.task_id = tk.id
    //             )
    // `;
    const sql = `
        SELECT tk.title, tk.deadline, tb.owner FROM tasks tk
        JOIN task_tabs tb ON tk.task_tabs_id = tb.id
        WHERE is_completed = 0 
            AND tk.deadline = NOW()
    `;
    const [rows] = await db.execute(sql);
    return rows.length > 0 ? rows.map(mapDeadlineToModel) : null;
};



module.exports = {
    getTasksByIdTab,
    getTaskById,
    getTaskStarred,
    getTaskDeadlined,
};
