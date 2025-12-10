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
        const data = await TaskTabService.getTaskTabWithTasks(id);
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

module.exports = { postTaskTabsHandler, getTaskTabWithTasks, getAllTaskTabs };
