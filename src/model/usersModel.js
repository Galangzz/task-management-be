const db = require('../config/database');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const UserModel = {
    addUser: async ({ username, email, hashedPassword }) => {
        // await UserModel.verifyNewUsername(username);
        // await UserModel.verifyNewEmail(email);

        const id = `user-${nanoid(16)}`;

        const sql = 'INSERT INTO users(id, username, email, password) VALUES(?, ?, ?, ?)';
        const values = [id, username, email, hashedPassword];

        const [rows] = await db.execute(sql, values);

        if (rows.affectedRows !== 1) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return id;
    },
    verifyNewUsername: async (username) => {
        const sql = 'SELECT username FROM users WHERE username = ?';
        const values = [username];

        const [rows] = await db.execute(sql, values);
        if (rows.length > 0) {
            throw new InvariantError('Username telah digunakan');
        }
    },
    verifyNewEmail: async (email) => {
        const sql = 'SELECT email FROM users WHERE email = ?';
        const values = [email];

        const [rows] = await db.execute(sql, values);
        if (rows.length > 0) {
            throw new InvariantError('Email sudah pernah didaftarkan');
        }
    },
    verifyUserCredentials: async (email, password) => {
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
    },
};

module.exports = UserModel;
