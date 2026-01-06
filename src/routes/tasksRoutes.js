const express = require('express');
const TaskController = require('../controllers/tasksController');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const {
    getAllTasksSchema,
    postTaskSchema,
    patchTaskBodySchema,
    patchTaskParamsSchema,
    getTaskById,
    putTaskBodySchema,
    putTaskParamsSchema,
} = require('../validator/tasksSchema');

const router = express.Router();

// "/api/tasks"

router
    .route('/')
    .get(validate(getAllTasksSchema, 'body'), TaskController.getTaskController)
    .post(validate(postTaskSchema, 'body'), TaskController.postTaskController)
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .get(validate(getTaskById, 'params'), TaskController.getTaskByIdController)
    .patch(
        validate(patchTaskParamsSchema, 'params'),
        validate(patchTaskBodySchema, 'body'),
        TaskController.patchTaskController
    )
    .put(validate(putTaskParamsSchema, 'params'), validate(putTaskBodySchema, 'body'), TaskController.putTaskController)
    .all(methodNotAllowed(['GET', 'PATCH', 'PUT']));

module.exports = router;
