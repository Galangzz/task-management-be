const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const TaskTabsModel = require('../models/Tab');
const { nanoid } = require('nanoid');
const { toMySQLDateTime } = require('../utils');

async function postTab(req, res) {
    const { name } = req.body;
    const { id: ownerId } = req.user;

    const id = `tab-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const existingTab = await TaskTabsModel.getTaskTabByName(name, ownerId);

    if (existingTab) {
        throw new InvariantError('Judul tidak boleh duplikat');
    }

    const result = await TaskTabsModel.addTaskTab(id, name, toMySQLDateTime(createdAt), ownerId);

    if (!result) {
        throw new InvariantError('Gagal menambahkan task tab');
    }

    res.status(201).json({
        status: 'success',
        message: 'Berhasil menambahkan task tab',
        data: { id, name, createdAt, deletePermission: true },
    });
}
async function getTabById(req, res) {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    let data;

    if (id === 'main-task') {
        data = await TaskTabsModel.getTabByIdMainTask(id, ownerId);
    } else {
        await TaskTabsModel.verifyTabOwner(id, ownerId);
        data = await TaskTabsModel.getTabById(id);
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

async function getTabs(req, res) {
    const { id: ownerId } = req.user;
    const data = await TaskTabsModel.getTabs(ownerId);
    res.status(200).json({
        status: 'success',
        data,
    });
}

async function deleteTabById(req, res) {
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

    const status = await TaskTabsModel.deleteTabById(id);

    if (!status) {
        throw new InvariantError('Gagal menghapus task tab');
    }

    res.status(200).json({
        status: 'success',
        message: 'Task tab berhasil dihapus',
    });
}

module.exports = { postTab, getTabs, deleteTabById, getTabById };
