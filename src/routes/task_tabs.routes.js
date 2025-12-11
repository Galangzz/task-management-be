const express = require('express');
const TaskTabsController = require('../controllers/task_tabs.controller');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');

const router = express.Router();

// "/api/task-tabs"

router
    .route('/')
    .get(TaskTabsController.getAllTaskTabs)
    .post(TaskTabsController.postTaskTabsHandler)
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .get(TaskTabsController.getTaskTabWithTasks)
    .delete(TaskTabsController.deleteTaskTab)
    .all(methodNotAllowed(['GET', 'DELETE']));

router
    .route('/tab/:id')
    .get(TaskTabsController.getTaskTabById)
    .all(methodNotAllowed(['GET']));

module.exports = router;
