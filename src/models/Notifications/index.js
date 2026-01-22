const add = require('./notification/addNotification');
const del = require('./notification/deleteNotification');

module.exports = { ...add, ...del };
