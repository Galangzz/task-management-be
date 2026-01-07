const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const { postTaskTabsSchema, idTaskSchema } = require('../validator/taskTabsSchema');
const TaskTabsController = require('../controllers/taskTabsController');

const router = express.Router();

// "/api/task-tabs"

router
    .route('/')
    .get(asyncHandler(TaskTabsController.getAllTaskTabs))
    .post(validate(postTaskTabsSchema, 'body'), asyncHandler(TaskTabsController.postTaskTabsHandler))
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .get(validate(idTaskSchema, 'params'), asyncHandler(TaskTabsController.getTaskTabWithTasks))
    .delete(validate(idTaskSchema, 'params'), asyncHandler(TaskTabsController.deleteTaskTab))
    .all(methodNotAllowed(['GET', 'DELETE']));

router
    .route('/tab/:id')
    .get(validate(idTaskSchema, 'params'), asyncHandler(TaskTabsController.getTaskTabById))
    .all(methodNotAllowed(['GET']));

module.exports = router;
