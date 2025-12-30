const AuthenticationError = require('../exceptions/AuthenticationError');
const TokenManager = require('../utils/tokenize/TokenManager');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AuthenticationError('Unauthenticated');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = TokenManager.verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};
