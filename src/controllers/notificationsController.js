const { nanoid } = require('nanoid');
const NotificationsModel = require('../models/Notifications');

async function postNotificationsToken(req, res) {
    const { id: userId } = req.user;
    const { token } = req.body;
    const id = `notification-${nanoid(16)}`;

    const { status, message } = await NotificationsModel.addNotificationToken(id, userId, token);

    res.status(status).json({
        status: 'success',
        message: message,
    });
}

module.exports = { postNotificationsToken };
