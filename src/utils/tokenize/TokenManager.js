const jwt = require('jsonwebtoken');
const AuthError = require('../../exceptions/AuthError');

const TokenManager = {
    generateAccessToken: (payload) =>
        jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_TTL,
        }),

    generateRefreshToken: (payload) =>
        jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: process.env.REFRESH_TOKEN_TTL,
        }),

    verifyAccessToken: (accessToken) => {
        try {
            return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
        } catch (error) {
            throw new AuthError('Access token tidak valid');
        }
    },
    verifyRefreshToken: (refreshToken) => {
        try {
            return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        } catch (error) {
            throw new AuthError('Refresh token tidak valid');
        }
    },
};

module.exports = TokenManager;
