const AuthenticationError = require('../exceptions/AuthenticationError');
const UserModel = require('../model/User');
const TokenManager = require('../utils/tokenize/TokenManager');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AuthenticationError('Unauthenticated');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = TokenManager.verifyAccessToken(token);
        await UserModel.verifyUser(payload.id);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};
