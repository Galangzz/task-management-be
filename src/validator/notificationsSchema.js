const Joi = require('joi');

const postTokenSchema = Joi.object({
    token: Joi.string().required(),
});

module.exports = { postTokenSchema };
