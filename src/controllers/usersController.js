const UserModel = require('../model/usersModel');

async function postUserController(req, res, next) {
    const { username, email, password } = req.body;
    try {
        const userId = await UserModel.addUser({ username, email, password });
        res.status(201).json({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { postUserController };
