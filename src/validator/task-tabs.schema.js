const Joi = require('joi');

const postTaskTabsSchema = Joi.object({
    name: Joi.string().trim().required(),
});

const idTaskSchema = Joi.object({
    id: Joi.string().trim().required(),
});

module.exports = { postTaskTabsSchema, idTaskSchema };
