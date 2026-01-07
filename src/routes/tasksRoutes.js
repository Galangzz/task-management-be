const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const {
    getAllTasksSchema,
    postTaskSchema,
    patchTaskBodySchema,
    patchTaskParamsSchema,
    getTaskById,
    putTaskBodySchema,
    putTaskParamsSchema,
} = require('../validator/tasksSchema');
const TaskController = require('../controllers/tasksController');

const router = express.Router();

// "/api/tasks"

router
    .route('/')
    .get(validate(getAllTasksSchema, 'query'), asyncHandler(TaskController.getTasksController))
    .post(validate(postTaskSchema, 'body'), asyncHandler(TaskController.postTaskController))
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .get(validate(getTaskById, 'params'), asyncHandler(TaskController.getTaskByIdController))
    .patch(
        validate(patchTaskParamsSchema, 'params'),
        validate(patchTaskBodySchema, 'body'),
        asyncHandler(TaskController.patchTaskController)
    )
    .put(
        validate(putTaskParamsSchema, 'params'),
        validate(putTaskBodySchema, 'body'),
        asyncHandler(TaskController.putTaskController)
    )
    .all(methodNotAllowed(['GET', 'PATCH', 'PUT']));

module.exports = router;
