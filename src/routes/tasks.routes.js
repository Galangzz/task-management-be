const express = require('express');
const TaskController = require('../controllers/tasks.controller');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const {
    getAllTasksSchema,
    postTaskSchema,
    patchTaskBodySchema,
    patchTaskParamsSchema,
} = require('../validator/tasks.schema');

const router = express.Router();

// "/api/tasks"

router
    .route('/')
    .get(validate(getAllTasksSchema, 'body'), TaskController.getTaskController)
    .post(validate(postTaskSchema, 'body'), TaskController.postTaskController)
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .patch(
        validate(patchTaskParamsSchema, 'params'),
        validate(patchTaskBodySchema, 'body'),
        TaskController.patchTaskController
    )
    .all(methodNotAllowed(['PATCH']));

module.exports = router;
