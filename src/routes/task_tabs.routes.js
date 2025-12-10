const express = require('express');
const TaskTabsController = require('../controllers/task_tabs.controller');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');

const router = express.Router();

// "/task-tabs"

router
    .route('/')
    .get(TaskTabsController.getAllTaskTabs)
    .post(TaskTabsController.postTaskTabsHandler)
    .all(methodNotAllowed(['GET', 'POST']));
    
router.get('/:id', TaskTabsController.getTaskTabWithTasks);

module.exports = router;
