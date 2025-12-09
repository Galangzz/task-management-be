const express = require('express');
const { postTaskTabs } = require('../controllers/task_tab.controller');

const router = express.Router();

router.post('/task-tabs', postTaskTabs);

module.exports = router;
