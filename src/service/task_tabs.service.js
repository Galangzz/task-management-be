const InvariantError = require('../exceptions/InvariantError');
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

module.exports = { addTaskTab };
