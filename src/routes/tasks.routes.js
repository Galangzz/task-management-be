const express = require('express');
const TaskController = require('../controllers/tasks.controller');

const router = express.Router();

router.get('/tasks', TaskController.getAllTasksHandler);

module.exports = router;
