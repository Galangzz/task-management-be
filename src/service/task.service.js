const TaskModel = require('../model/task.model');

async function getAllTasks(id) {
    return await TaskModel.getAllTasks(id);
}

module.exports = {
    getAllTasks,
};
