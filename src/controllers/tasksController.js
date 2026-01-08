const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const TaskModel = require('../models/Task');
const TabModel = require('../models/Tab');

async function getTasksController(req, res) {
    const { tabId } = req.query;
    const { id: credentialId } = req.user;
    let data;
    if (tabId === 'starred-task') {
        data = await TaskModel.getTaskStarred(credentialId);
    } else {
        await TabModel.verifyTabOwner(tabId, credentialId);
        data = await TaskModel.getTasksByIdTab(tabId);
    }

    res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan tugas',
        data: data ? (Array.isArray(data) ? data : [data]) : [],
    });
}

async function postTaskController(req, res) {
    const { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId } = req.body;
    const { id: credentialId } = req.user;
    const id = `task-${nanoid(16)}`;
    //verify tab owner
    await TabModel.verifyTabOwner(taskTabId, credentialId);

    const result = await TaskModel.addTaskModel(id, {
        title,
        detail,
        deadline,
        hasDate,
        hasTime,
        starred,
        isCompleted,
        taskTabId,
    });

    if (!result) {
        throw new InvariantError('Gagal menambahkan tugas');
    }

    res.status(201).json({
        status: 'success',
        message: 'Tugas berhasil ditambahkan',
        data: result,
    });
}

async function patchTaskController(req, res) {
    const { id } = req.params;
    const { starred, isCompleted } = req.body;
    const { id: credentialId } = req.user;

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

    if (field.length === 0) {
        throw new InvariantError('Tidak ada field yang diperbarui');
    }

    await TaskModel.verifyTaskOwner(id, credentialId);

    const result = await TaskModel.updateTaskModel(id, field, values);

    if (!result) {
        throw new InvariantError('Gagal memperbarui catatan');
    }

    res.status(200).json({
        status: 'success',
        message: 'Tugas berhasil diperbaharui',
        data: {
            id: result,
        },
    });
}

async function getTaskByIdController(req, res) {
    const { id } = req.params;

    const result = await TaskModel.getTaskById(id);

    res.status(200).json({
        status: 'success',
        data: result,
    });
}

async function putTaskController(req, res) {
    const { id: ownerId } = req.user;
    const { id } = req.params;
    const { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId } = req.body;
    await TaskModel.verifyTaskOwner(id, ownerId);
    const field = [
        'title = ?',
        'detail = ?',
        'deadline = ?',
        'has_date = ?',
        'has_time = ?',
        'starred = ?',
        'is_completed = ?',
        'task_tabs_id = ?',
    ];
    const values = [title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId];

    const result = await TaskModel.updateTaskModel(id, field, values);

    if (!result) {
        throw new InvariantError('Gagal memperbarui tugas');
    }

    res.status(200).json({
        status: 'success',
        message: 'Tugas berhasil diperbaharui',
        data: {
            id: result,
        },
    });
}

async function deleteTaskByIdController(req, res) {
    const { id: ownerId } = req.user;
    const { id } = req.params;

    await TaskModel.verifyTaskOwner(id, ownerId);

    const result = await TaskModel.deleteTaskById(id);

    if (!result) {
        throw new InvariantError('Gagal menghapus tugas');
    }

    res.status(200).json({
        status: 'success',
        message: 'Tugas berhasil dihapus',
    });
}

module.exports = {
    getTasksController,
    postTaskController,
    patchTaskController,
    getTaskByIdController,
    putTaskController,
    deleteTaskByIdController
};
