const NotFoundError = require('../exceptions/NotFoundError');

const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`);
    next(error);
};

module.exports = notFoundHandler;
