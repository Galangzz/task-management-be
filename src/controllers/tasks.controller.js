const { getAllTasks } = require('../service/tasks.service');

async function getAllTasksHandler(req, res) {
    const { id } = req.body;
    try {
        const data = await getAllTasks(id);
        res.json({
            status: 'success',
            data,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
}

module.exports = {
    getAllTasksHandler,
};
