const express = require('express');
const { postTaskTabsHandler } = require('../controllers/task_tab.controller');

const router = express.Router();

router.post('/task-tabs', postTaskTabsHandler);

module.exports = router;
