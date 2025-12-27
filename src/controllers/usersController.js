const UserModel = require('../model/usersModel');
const UserService = require('../service/usersService');
const bcrypt = require('bcrypt');

async function signupUserController(req, res, next) {
    const { username, email, password } = req.body;

    try {
        await UserModel.verifyNewEmail(email);
        await UserModel.verifyNewUsername(username);

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserService.saveUserData({ username, email, password: hashedPassword });

        await UserService.sendOTP(email);

        res.status(201).json({
            status: 'success',
            message: 'OTP berhasil dikirim, silahkan cek email',
        });
    } catch (error) {
        next(error);
    }
}

async function verifyOTPController(req, res, next) {
    const { email, otp } = req.body;

    try {
        await UserService.verifyOTP(email, otp);
        const data = await UserService.getUserData(email);

        const userId = await UserModel.addUser({
            username: data.username,
            email: data.email,
            hashedPassword: data.password,
        });

        await UserService.deleteUserData(email);
        res.status(201).json({
            status: 'success',
            message: `Regristrasi berhasil ${email}`,
            data: {
                userId,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { signupUserController, verifyOTPController };
