const express = require('express');
const TaskTabsController = require('../controllers/task_tabs.controller');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const { postTaskTabsSchema, idTaskSchema } = require('../validator/task-tabs.schema');

const router = express.Router();

// "/api/task-tabs"

router
    .route('/')
    .get(TaskTabsController.getAllTaskTabs)
    .post(validate(postTaskTabsSchema, 'body'), TaskTabsController.postTaskTabsHandler)
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .get(validate(idTaskSchema, 'params'), TaskTabsController.getTaskTabWithTasks)
    .delete(validate(idTaskSchema, 'params'), TaskTabsController.deleteTaskTab)
    .all(methodNotAllowed(['GET', 'DELETE']));

router
    .route('/tab/:id')
    .get(validate(idTaskSchema, 'params'), TaskTabsController.getTaskTabById)
    .all(methodNotAllowed(['GET']));

module.exports = router;
