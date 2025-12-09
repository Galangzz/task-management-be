const { addTaskTab } = require('../service/task_tab.service');

async function postTaskTabs(req, res) {
    const { name } = req.body;

    try {
        const succes = await addTaskTab(name);
        if (!succes) {
            return res.status(400).json({
                status: 'fail',
                message: 'Gagal menambahkan task tab',
            });
        }
        res.json({
            status: 'succes',
            message: 'Berhasil menambahkan task tab',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
}

module.exports = { postTaskTabs };
