const addTask = require('./tasks/addTask');
const deleteTask = require('./tasks/deleteTask');
const getTask = require('./tasks/getTask');
const updateTask = require('./tasks/updateTask');
const verifyTask = require('./tasks/verifyTask');

module.exports = { ...addTask, ...deleteTask, ...getTask, ...updateTask, ...verifyTask };
