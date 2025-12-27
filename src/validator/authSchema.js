const Joi = require('joi');

const postAuthSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
});

const putAuthSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const deleteAuthSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = { postAuthSchema, putAuthSchema, deleteAuthSchema };
