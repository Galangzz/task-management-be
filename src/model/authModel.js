const db = require('../config/database');



const AuthModel = {
    getUsernameUser: async (username) => {
        const sql = 'SELECT username FROM users WHERE username = ?';
        const values = [username];

        const rows = await db.execute(sql, values);
        return rows.length > 0 ? rows[0] : null;
    },
    getEmailUser: async (email) => {
        const sql = 'SELECT email FROM users WHERE email = ?';
        const values = [email];

        const rows = await db.execute(sql, values);
        return rows.length > 0 ? rows[0] : null;
    },
};

module.exports = AuthModel;
