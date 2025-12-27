const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const TaskModel = require('../model/tasksModel');
const TabModel = require('../model/taskTabsModel');

async function getTaskController(req, res, next) {
    const { id } = req.body;
    const { id: credentialId } = req.user;
    console.log(id);
    try {
        await TaskModel.verifyTaskOwner(id, credentialId);
        const data = await TaskModel.getTaskByIdModel(id);

        if (!data) {
            throw new InvariantError('Tugas tidak ditemukan');
        }

        res.status(200).json({
            status: 'success',
            message: 'Berhasil mendapatkan tugas',
            data,
        });
    } catch (error) {
        next(error);
    }
}

async function postTaskController(req, res, next) {
    const { title, detail, deadline, hasDate, hasTime, starred, isCompleted, taskTabId } = req.body;
    const { id: credentialId } = req.user;
    try {
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
    } catch (error) {
        next(error);
    }
}

async function patchTaskController(req, res, next) {
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

    try {
        await TaskModel.verifyTaskOwner(id, credentialId)
        
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
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTaskController,
    postTaskController,
    patchTaskController,
};
