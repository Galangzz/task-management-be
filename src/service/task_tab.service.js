const TaskTabsModel = require('../model/task_tab.model');

async function addTaskTab(name) {
    return await TaskTabsModel.addTaskTab(name);
}

module.exports = { addTaskTab };
