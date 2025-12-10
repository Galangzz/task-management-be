const { response } = require('express');
const TaskService = require('../service/tasks.service');

async function getAllTasksHandler(req, res, next) {
    const { id } = req.body;
    try {
        const data = await TaskService.getTaskById(id);
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        next(error);
    }
}

async function addTaskHandler(req, res, next) {
    const { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId } = req.body;
    try {
        const result = await TaskService.addTask({
            title,
            detail,
            deadline,
            hasDate,
            hasTime,
            starred,
            isCompleted,
            taskTabId,
        });
        res.status(201).json({
            status: 'success',
            message: 'Task berhasil ditambahkan',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllTasksHandler,
    addTaskHandler,
};
