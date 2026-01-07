const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const TaskTabsModel = require('../models/Tab');
const { nanoid } = require('nanoid');

async function postTaskTabsHandler(req, res) {
    const { name } = req.body;
    const { id: ownerId } = req.user;

    const id = `tab-${nanoid(16)}`;

    const existingTab = await TaskTabsModel.getTaskTabByName(name, ownerId);

    if (existingTab) {
        throw new InvariantError('Judul tidak boleh duplikat');
    }

    const result = await TaskTabsModel.addTaskTab(id, name, ownerId);

    if (!result) {
        throw new InvariantError('Gagal menambahkan task tab');
    }

    res.status(201).json({
        status: 'success',
        message: 'Berhasil menambahkan task tab',
        data: { id, name },
    });
}
async function getTaskTabById(req, res) {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    let data;

    if (id === 'main-task') {
        data = await TaskTabsModel.getTaskTabByIdMainTask(id, ownerId);
    } else {
        await TaskTabsModel.verifyTabOwner(id, ownerId);
        data = await TaskTabsModel.getTaskTabById(id);
    }

    if (!data) {
        throw new NotFoundError('Task tab tidak ditemukan');
    }

    res.status(200).json({
        status: 'success',
        message: 'Berhasil mengambil tab',
        data: data,
    });
}

async function getTaskTabWithTasks(req, res) {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    let data;
    if (id === 'starred-task') {
        const result = await TaskTabsModel.getStarredTaskTab(ownerId);
        data = {
            id: 'starred-task',
            name: 'Starred Task',
            tasks: result.length > 1 ? result : [...result],
        };
    } else if (id === 'main-task') {
        data = await TaskTabsModel.getMainTaskTab(ownerId);
    } else {
        await TaskTabsModel.verifyTabOwner(id, ownerId);
        data = await TaskTabsModel.getTaskTabWithTasks(id);
    }

    res.status(200).json({
        status: 'success',
        data,
    });
}

async function getAllTaskTabs(req, res) {
    const { id: ownerId } = req.user;
    const data = await TaskTabsModel.getAllTaskTabs(ownerId);
    res.status(200).json({
        status: 'success',
        data,
    });
}

async function deleteTaskTab(req, res) {
    const { id } = req.params;
    const { id: ownerId } = req.user;
    await TaskTabsModel.verifyTabOwner(id, ownerId);
    const permission = await TaskTabsModel.getDeletePermissionTaskTabs(id);

    if (permission == false) {
        return res.status(403).json({
            status: 'fail',
            message: 'Task tab tidak bisa dihapus',
        });
    }

    await TaskTabsModel.deleteTaskTab(id);

    res.status(200).json({
        status: 'success',
        message: 'Task tab berhasil dihapus',
    });
}

module.exports = { postTaskTabsHandler, getTaskTabWithTasks, getAllTaskTabs, deleteTaskTab, getTaskTabById };
