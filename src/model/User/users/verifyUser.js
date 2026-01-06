const db = require('../../../config/database');
const AuthenticationError = require('../../../exceptions/AuthenticationError');
const InvariantError = require('../../../exceptions/InvariantError');

async function verifyNewUsername(username) {
    const sql = 'SELECT username FROM users WHERE username = ?';
    const values = [username];

    const [rows] = await db.execute(sql, values);
    if (rows.length > 0) {
        throw new InvariantError('Username telah digunakan');
    }
}

async function verifyNewEmail(email) {
    const sql = 'SELECT email FROM users WHERE email = ?';
    const values = [email];

    const [rows] = await db.execute(sql, values);
    if (rows.length > 0) {
        throw new InvariantError('Email sudah pernah didaftarkan');
    }
}

async function verifyUserCredentials(email, password) {
    const sql = 'SELECT id, password FROM users WHERE email = ?';
    const values = [email];

    const [rows] = await db.execute(sql, values);
    if (rows.length === 0) {
        throw new AuthenticationError('Email atau Password salah');
    }

    const { id, password: hashedPassword } = rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
        throw new AuthenticationError('Email atau Password salah');
    }

    return id;
}

async function verifyUser(id) {
    const sql = 'SELECT id FROM users WHERE id = ?';
    const values = [id];

    const [rows] = await db.execute(sql, values);
    if (rows.length === 0) {
        throw new AuthenticationError('User tidak ditemukan');
    }
}

module.exports = {
    verifyNewUsername,
    verifyNewEmail,
    verifyUserCredentials,
    verifyUser,
};
