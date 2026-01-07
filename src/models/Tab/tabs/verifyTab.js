const db = require('../../../config/database');
const AuthorizationError = require('../../../exceptions/AuthorizationError');
const NotFoundError = require('../../../exceptions/NotFoundError');

const verifyTabOwner = async (id, owner) => {
    const sql = `SELECT tb.owner 
            FROM task_tabs tb 
            JOIN users u ON tb.owner = u.id
            WHERE tb.id = ?`;
    const values = [id];

    const [rows] = await db.execute(sql, values);
    if (!rows.length) {
        throw new NotFoundError('Tab tidak ditemukan');
    }

    const tab = rows[0];
    if (tab.owner !== owner) {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
};

module.exports = { verifyTabOwner };
