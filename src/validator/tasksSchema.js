const Joi = require('joi');

const getAllTasksSchema = Joi.object({
    tabId: Joi.string().trim().required(),
});

const postTaskSchema = Joi.object({
    title: Joi.string().trim().empty('').default(null),
    detail: Joi.string().trim().empty('').default(null),
    deadline: Joi.date().iso().allow(null),
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
    starred: Joi.boolean().allow(null),
    isCompleted: Joi.boolean().allow(null),
}).custom((value, helpers) => {
    const { starred, isCompleted } = value;

    if (starred === null && isCompleted === null) {
        return helpers.error('any.invalid');
    }

    return value;
}, 'At least one boolean value is required');

const getTaskById = Joi.object({
    id: Joi.string().trim().required(),
});

const putTaskParamsSchema = Joi.object({
    id: Joi.string().trim().required(),
});

const putTaskBodySchema = Joi.object({
    title: Joi.string().trim().empty('').default(null),
    detail: Joi.string().trim().empty('').default(null),
    deadline: Joi.date().iso().allow(null),
    hasDate: Joi.boolean().required(),
    hasTime: Joi.boolean().required(),
    starred: Joi.boolean().required(),
    isCompleted: Joi.boolean().required(),
    taskTabId: Joi.string().trim().required(),
});

module.exports = {
    getAllTasksSchema,
    postTaskSchema,
    patchTaskBodySchema,
    patchTaskParamsSchema,
    getTaskById,
    putTaskParamsSchema,
    putTaskBodySchema,
};
