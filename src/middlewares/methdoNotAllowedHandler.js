const MethodError = require('../exceptions/MethodError');

// Middleware untuk handle method yang tidak diizinkan
const methodNotAllowed = (allowedMethods) => {
    return (req, res, next) => {
        const error = new MethodError(
            `Method ${req.method} not allowed on ${req.originalUrl}. Allowed: ${allowedMethods.join(', ')}`
        );
        res.set('Allow', allowedMethods.join(', '));
        next(error);
    };
};

module.exports = methodNotAllowed;
