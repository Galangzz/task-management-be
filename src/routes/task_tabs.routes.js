const express = require('express');
const TaskTabsController = require('../controllers/task_tabs.controller');

const router = express.Router();

// "/task-tabs"

router.post('/', TaskTabsController.postTaskTabsHandler);
router.get('/:id', TaskTabsController.getTaskTabWithTasks);

module.exports = router;
