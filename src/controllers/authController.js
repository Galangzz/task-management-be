const AuthModel = require('../model/authModel');
const UserModel = require('../model/usersModel');
const token = require('../utils/tokenize/TokenManager');

async function postAuthController(req, res, next) {
    const { email, password } = req.body;
    try {
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
    } catch (error) {
        next(error);
    }
}

async function getNewAccessToken(req, res, next) {
    const { jwt: refreshToken } = req.cookies;
    try {
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
        next(error);
    }
}

async function deleteAuthController(req, res, next) {
    const { jwt: refreshToken } = req.cookies;
    try {
        await AuthModel.verifyRefreshToken(refreshToken);
        await AuthModel.deleteRefreshToken(refreshToken);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

async function getMe(req, res) {
    const { id } = req.user;
    res.status(200).json({
        data: {
            id: id,
        },
    });
}

module.exports = { postAuthController, getNewAccessToken, deleteAuthController, getMe };
