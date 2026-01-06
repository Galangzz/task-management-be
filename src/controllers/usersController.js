const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const UserModel = require('../model/User');
const UserService = require('../service/usersService');

const TabModel = require('../model/Tab');

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

        // Add initial tab
        const id = `tab-${nanoid(16)}`;
        await TabModel.addMainTask(id, userId);

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

async function resendOTPController(req, res, next) {
    const { email } = req.body;

    try {
        await UserService.sendOTP(email);
        res.status(200).json({
            status: 'success',
            message: 'OTP berhasil dikirim, silahkan cek email',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { signupUserController, verifyOTPController, resendOTPController };
