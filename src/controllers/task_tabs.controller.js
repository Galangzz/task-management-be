const TaskTabService = require('../service/task_tabs.service');

async function postTaskTabsHandler(req, res, next) {
    const { name } = req.body;

    try {
        const taskTab = await TaskTabService.addTaskTab(name);

        res.status(201).json({
            status: 'success',
            message: 'Berhasil menambahkan task tab',
            data: taskTab,
        });
    } catch (error) {
        next(error);
    }
}

async function getTaskTabWithTasks(req, res, next) {
    const { id } = req.params;

    try {
        let data;
        if (id === 'starred-task') {
            data = await TaskTabService.getStarredTaskTab();
        } else {
            data = await TaskTabService.getTaskTabWithTasks(id);
        }
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllTaskTabs(req, res, next) {
    try {
        const data = await TaskTabService.getAllTaskTabs();
        res.status(200).json({
            status: 'success',
            data,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteTaskTab(req, res, next) {
    const { id } = req.params;
    try {
        const result = await TaskTabService.deleteTaskTab(id);
        res.status(200).json({
            status: 'success',
            message: 'Task tab berhasil dihapus',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { postTaskTabsHandler, getTaskTabWithTasks, getAllTaskTabs, deleteTaskTab };
