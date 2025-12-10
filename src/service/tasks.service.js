const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const TaskModel = require('../model/tasks.model');

async function getTaskById(id) {
    const result = await TaskModel.getTaskById(id);
    if (!result) {
        throw new InvariantError('Task tidak ditemukan');
    }
    return result;
}

async function addTask(task) {
    const id = `task-${nanoid(16)}`;
    const result = await TaskModel.addTask(id, task);
    if (!result) {
        throw new InvariantError('Gagal menambahkan task');
    }
    return result;
}

module.exports = {
    getTaskById,
    addTask,
};
