const TaskService = require('../service/tasks.service');

async function getAllTasksController(req, res, next) {
    const { id } = req.body;
    try {
        const data = await TaskService.getTaskByIdService(id);
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        next(error);
    }
}

async function postTaskController(req, res, next) {
    const { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId } = req.body;
    try {
        const result = await TaskService.addTaskService({
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

async function patchTaskController(req, res, next) {
    const { id } = req.params;
    const { starred, isCompleted } = req.body;
    console.log({ starred, isCompleted });
    const field = [];
    const values = [];

    if (starred !== undefined && starred !== null) {
        field.push('starred = ?');
        values.push(starred ? 1 : 0);
    }

    if (isCompleted !== undefined && isCompleted !== null) {
        field.push('is_completed = ?');
        values.push(isCompleted ? 1 : 0);
    }

    try {
        const result = await TaskService.patchTaskService(id, field, values);
        res.status(200).json({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
            data: {
                id: result,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllTasksController,
    postTaskController,
    patchTaskController,
};
