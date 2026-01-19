const { CronJob } = require('cron');
const { io } = require('../../server');
const { getTaskDeadlined } = require('../../models/Task');

const job = new CronJob(
    '* * * * *',
    async () => {
        try {
            console.log('[CRON] checking deadlines');
            const tasks = await getTaskDeadlined();
            console.log({ tasksLength:  tasks ? tasks.length : 0 });
            if (tasks) {
                for (const task of tasks) {
                    console.log({ task });
                }
            }
        } catch (error) {
            console.log({ error });
        }
    },
    null,
    true,
    'Asia/Jakarta',
);

module.exports = job;
