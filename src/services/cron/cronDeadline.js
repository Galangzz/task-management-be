const { CronJob } = require('cron');
const { getTaskDeadlined } = require('../../models/Task');
const { sendPushNotification } = require('../firebase/fcmService');

function startDeadlineCron(io) {
    return new CronJob(
        '* * * * *',
        async () => {
            try {
                console.log('[CRON] checking deadlines');
                const tasks = await getTaskDeadlined();

                if (!tasks) return;
                // console.log({ TaskLength: tasks ? tasks.length : 0 });

                // console.log({ tasks });
                for (const task of tasks) {
                    console.log({ task });
                    console.log({ room: io.of('/').adapter.rooms.has(`user-${task.userId}`) });
                    io.to(`user-${task.userId}`).emit('deadline-reminder', {
                        title: task.title,
                        deadline: task.deadline,
                    });
                    sendPushNotification({
                        token: task.token,
                        title: 'Deadline Reminder!!!',
                        body: `${task.title} Deadline ${new Date(task.deadline).toLocaleDateString('id-ID')}`,
                    });
                }
            } catch (error) {
                console.error('[CRON ERROR]', error);
            }
        },
        null,
        true,
        'Asia/Jakarta',
    );
}

module.exports = { startDeadlineCron };
