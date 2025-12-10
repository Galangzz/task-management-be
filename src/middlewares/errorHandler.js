const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
    if (err instanceof ClientError) {
        if (process.env.NODE_ENV === 'development') {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err,
                stack: err.stack,
            });
        }

        if (process.env.NODE_ENV === 'production') {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
    }

    console.error('Error: ', err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = errorHandler;
