const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const UserModel = require('../models/User');
const UserService = require('../services/usersService');

const TabModel = require('../models/Tab');

async function signupUserController(req, res) {
    const { username, email, password } = req.body;

    await UserModel.verifyNewEmail(email);
    await UserModel.verifyNewUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserService.saveUserData({ username, email, password: hashedPassword });

    await UserService.sendOTP(email);

    res.status(201).json({
        status: 'success',
        message: 'OTP berhasil dikirim, silahkan cek email',
    });
}

async function verifyOTPController(req, res) {
    const { email, otp } = req.body;

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
}

async function resendOTPController(req, res) {
    const { email } = req.body;

    await UserService.sendOTP(email);
    res.status(200).json({
        status: 'success',
        message: 'OTP berhasil dikirim, silahkan cek email',
    });
}

module.exports = { signupUserController, verifyOTPController, resendOTPController };
