const db = require('../../../config/database');
const InvariantError = require('../../../exceptions/InvariantError');

const addMainTask = async (id, owner) => {
    const sql = `INSERT INTO task_tabs(id, name, delete_permission, owner) 
                VALUES(?, ?, ?, ?)`;
    const values = [id, 'Tugas Saya', false, owner];

    const [rows] = await db.execute(sql, values);
    if (rows.affectedRows === 0) {
        throw new InvariantError('Gagal menambahkan tab awal');
    }
};

const addTaskTab = async (id, name, createdAt, ownerId) => {
    const sql = 'INSERT INTO task_tabs(id, name, created_at, owner) VALUES(?, ?, ?, ?)';
    const values = [id, name, createdAt, ownerId];

    const [rows] = await db.execute(sql, values);
    return rows.affectedRows > 0;
};

module.exports = { addMainTask, addTaskTab };
