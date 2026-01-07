const db = require('../../../config/database');
const NotFoundError = require('../../../exceptions/NotFoundError');
const { mapTaskToModel } = require('../../../utils');

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

module.exports = {
    getTasksByIdTab,
    getTaskById,
};
