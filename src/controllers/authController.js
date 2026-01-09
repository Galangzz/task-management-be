const AuthModel = require('../models/authModel');
const UserModel = require('../models/User');
const token = require('../utils/tokenize/TokenManager');

async function postAuthController(req, res) {
    const { email, password } = req.body;
    const id = await UserModel.verifyUserCredentials(email, password);

    const accessToken = token.generateAccessToken({ id });
    const refreshToken = token.generateRefreshToken({ id });

    await AuthModel.addRefreshToken(id, refreshToken);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
        .status(200)
        .json({
            status: 'success',
            message: 'Login berhasil',
            data: {
                accessToken,
            },
        });
}

async function getNewAccessToken(req, res, next) {
    try {
        const { jwt: refreshToken } = req.cookies;
        await AuthModel.verifyRefreshToken(refreshToken);
        const { id } = token.verifyRefreshToken(refreshToken);

        const accessToken = token.generateAccessToken({ id });

        res.status(200).json({
            status: 'success',
            message: 'Access token berhasil diperbaharui ',
            data: {
                accessToken,
            },
        });
    } catch (error) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        next(error);
    }
}

async function deleteAuthController(req, res) {
    const { jwt: refreshToken } = req.cookies;
    await AuthModel.verifyRefreshToken(refreshToken);
    await AuthModel.deleteRefreshToken(refreshToken);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

async function getMe(req, res) {
    const { id } = req.user;

    const result = await UserModel.getUserData(id);
    let userData;
    if (result) {
        userData = {
            id: id,
            username: result.username,
            email: result.email,
        };
    } else {
        userData = null;
    }
    res.status(200).json({
        data: userData,
    });
}

module.exports = { postAuthController, getNewAccessToken, deleteAuthController, getMe };
