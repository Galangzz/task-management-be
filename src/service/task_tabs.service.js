const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const TaskTabsModel = require('../model/task_tabs.model');
const { nanoid } = require('nanoid');

async function addTaskTab(name) {
    const id = `tab-${nanoid(16)}`;

    const existingTab = await TaskTabsModel.getTaskTabByName(name);
    if (existingTab) {
        throw new InvariantError('Judul tidak boleh duplikat');
    }
    const result = await TaskTabsModel.addTaskTab(id, name);
    if (!result) {
        throw new InvariantError('Gagal menambahkan task tab');
    }
    return { id, name };
}
async function getTaskTabById(id) {
    const result = await TaskTabsModel.getTaskTabById(id);
    return result;
}

async function getTaskTabWithTasks(id) {
    const result = await TaskTabsModel.getTaskTabWithTasks(id);
    if (!result) {
        throw new NotFoundError('Task tab tidak ditemukan');
    }
    return result;
}

async function getAllTaskTabs() {
    const result = await TaskTabsModel.getAllTaskTabs();
    return result;
}

async function deleteTaskTab(id) {
    const permission = await TaskTabsModel.getDeletePermissionTaskTabs(id);

    if (typeof permission === 'number' && permission === 0) {
        throw new InvariantError('Task tab tidak bisa dihapus');
    }

    if (typeof permission !== 'number') {
        throw new InvariantError('Task tab tidak ditemukan');
    }

    const result = await TaskTabsModel.deleteTaskTab(id);
    if (!result) {
        throw new InvariantError('Task tab gagal dihapus');
    }
    return result;
}

async function getStarredTaskTab() {
    const result = await TaskTabsModel.getStarredTaskTab();
    return {
        id: 'starred-task',
        name: 'Starred Task',
        tasks: result.length > 1 ? result : [...result],
    };
}

module.exports = { addTaskTab, getTaskTabWithTasks, getAllTaskTabs, deleteTaskTab, getStarredTaskTab, getTaskTabById };
