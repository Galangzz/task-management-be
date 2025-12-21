const TokenManager = require('../utils/tokenize/TokenManager');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = TokenManager.verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (error) {
        next(err);
    }
};
