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

module.exports = { postTaskTabsHandler };
