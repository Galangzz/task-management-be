const db = require('../../../config/database');
const AuthorizationError = require('../../../exceptions/AuthorizationError');
const NotFoundError = require('../../../exceptions/NotFoundError');

const verifyTaskOwner = async (id, owner) => {
    const sql = `
            SELECT tb.owner as owner 
            FROM tasks tk 
            JOIN task_tabs tb ON tk.task_tabs_id = tb.id
            WHERE tk.id = ?
        `;
    const values = [id];

    const [rows] = await db.execute(sql, values);
    if (!rows.length) {
        throw new NotFoundError('Tugas tidak ditemukan');
    }

    const task = rows[0];
    if (task.owner !== owner) {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
};

module.exports = { verifyTaskOwner };
