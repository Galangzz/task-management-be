const AuthenticationError = require('../exceptions/AuthenticationError');
const UserModel = require('../models/User');
const TokenManager = require('../utils/tokenize/TokenManager');
const asyncHandler = require('./asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AuthenticationError('Unauthenticated');
    }

    const token = authHeader.split(' ')[1];

    const payload = TokenManager.verifyAccessToken(token);
    await UserModel.verifyUser(payload.id);
    req.user = payload;
    next();
});
