const TaskModel = require('../model/tasks.model');

async function getAllTasks(id) {
    return await TaskModel.getAllTasks(id);
}

module.exports = {
    getAllTasks,
};
