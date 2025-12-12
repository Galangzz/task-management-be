const express = require('express');
const TaskController = require('../controllers/tasks.controller');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');

const router = express.Router();

// "/api/tasks"

router
    .route('/')
    .get(TaskController.getAllTasksHandler)
    .post(TaskController.postTaskHandler)
    .all(methodNotAllowed(['GET', 'POST']));

module.exports = router;
