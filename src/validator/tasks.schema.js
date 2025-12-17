const Joi = require('joi');

const getAllTasksSchema = Joi.object({
    id: Joi.string().trim().required(),
});

const postTaskSchema = Joi.object({
    title: Joi.string().trim().required(),
    detail: Joi.string().trim().empty('').default(null),
    deadline: Joi.date().iso().optional(),
    hasDate: Joi.boolean().required(),
    hasTime: Joi.boolean().required(),
    starred: Joi.boolean().required(),
    isCompleted: Joi.boolean().required(),
    taskTabId: Joi.string().trim().required(),
});

const patchTaskParamsSchema = Joi.object({
    id: Joi.string().trim().required(),
});

const patchTaskBodySchema = Joi.object({
    starred: Joi.boolean(),
    isCompleted: Joi.boolean(),
}).or('starred', 'isCompleted');

module.exports = { getAllTasksSchema, postTaskSchema, patchTaskBodySchema, patchTaskParamsSchema };
