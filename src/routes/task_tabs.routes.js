const express = require('express');
const TaskTabsController = require('../controllers/task_tabs.controller');

const router = express.Router();

router.post('/task-tabs', TaskTabsController.postTaskTabsHandler);

module.exports = router;
