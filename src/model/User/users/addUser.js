const db = require('../../../config/database');
const InvariantError = require('../../../exceptions/InvariantError');

async function addUser({ username, email, hashedPassword }) {
    const id = `user-${nanoid(16)}`;

    const sql = 'INSERT INTO users(id, username, email, password) VALUES(?, ?, ?, ?)';
    const values = [id, username, email, hashedPassword];

    const [rows] = await db.execute(sql, values);

    if (rows.affectedRows !== 1) {
        throw new InvariantError('User gagal ditambahkan');
    }

    return id;
}

module.exports = { addUser };
