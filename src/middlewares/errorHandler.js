const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === 'ER_DUP_ENTRY') {
        err.statusCode = 400;
        err.message = 'Data sudah ada dalam database';
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        err.statusCode = 400;
        err.message = 'Data yang direferensikan tidak ditemukan';
    }

    if (err.code === 'ECONNREFUSED') {
        err.statusCode = 503;
        err.message = 'Database tidak dapat diakses';
    }

    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = 'Data tidak valid';
    }

    if (err.code === 'ER_DATA_TOO_LONG'){
        err.statusCode = 400;
        err.message= 'To Long'
    }

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
