const { fcm } = require('../../config/firebase');
const NotificationsModel = require('../../models/Notifications');

const sendPushNotification = async ({ token, title, body }) => {
    const message = {
        token,

        data: {
            title,
            body,
        },
    };

    try {
        const response = await fcm.send(message);
        console.log('FCM sent :', response);
        console.log({ fcmResponse: response });
        return response;
    } catch (error) {
        console.log({ fcmError: error });
        NotificationsModel.deleteNotificationToken(token)
            .then(() => {
                console.log('Notification token deleted');
            })
            .catch((error) => {
                console.error('Error deleting notification token:', error);
            });
    }
};

module.exports = { sendPushNotification };
