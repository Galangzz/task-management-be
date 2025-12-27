const Joi = require('joi');

const postAuthSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
    password: Joi.string().required(),
});

const putAuthSchema = Joi.object({
    jwt: Joi.string().required(),
});

const deleteAuthSchema = Joi.object({
    jwt: Joi.string().required(),
});

module.exports = { postAuthSchema, putAuthSchema, deleteAuthSchema };
