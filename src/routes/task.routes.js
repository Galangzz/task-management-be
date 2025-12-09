const express = require('express');
const { getAllTasksHandler } = require('../controllers/task.controller');

const router = express.Router();

router.get('/tasks', getAllTasksHandler);

module.exports = router;
