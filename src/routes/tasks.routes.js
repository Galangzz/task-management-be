const express = require('express');
const TaskController = require('../controllers/tasks.controller');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');

const router = express.Router();

// "/api/tasks"

router
    .route('/')
    .get(TaskController.getAllTasksController)
    .post(TaskController.postTaskController)
    .all(methodNotAllowed(['GET', 'POST']));

router
    .route('/:id')
    .patch(TaskController.patchTaskController)
    .all(methodNotAllowed(['PATCH']));

module.exports = router;
