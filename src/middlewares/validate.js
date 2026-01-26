const validate =
    (schema, property = 'body') =>
    (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true,
        });
        
        if (error) {
            console.error(error);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error',
                errors: error.details.map((d) => ({
                    field: d.path.join('.'),
                    message: d.message,
                })),
            });
        }

        req[property] = value; 
        next();
    };

module.exports = { validate };
