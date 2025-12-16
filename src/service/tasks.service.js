const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const TaskModel = require('../model/tasks.model');

async function getTaskByIdService(id) {
    const result = await TaskModel.getTaskByIdModel(id);
    if (!result) {
        throw new InvariantError('Catatan tidak ditemukan');
    }
    return result;
}

async function addTaskService(task) {
    const id = `task-${nanoid(16)}`;
    const result = await TaskModel.addTaskModel(id, task);
    if (!result) {
        throw new InvariantError('Gagal menambahkan catatan');
    }
    return result;
}

async function patchTaskService(id, field, values) {
    if (field.length === 0) {
        throw new InvariantError('Tidak ada field yang diperbarui');
    }

    const result = await TaskModel.updateTaskModel(id, field, values);
    if (!result) {
        throw new InvariantError('Gagal memperbarui catatan');
    }
    return result;
}

module.exports = {
    getTaskByIdService,
    addTaskService,
    patchTaskService,
};
