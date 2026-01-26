const addTab = require('./tabs/addTab');
const getTab = require('./tabs/getTab');
const deleteTab = require('./tabs/deleteTab');
const verifyTab = require('./tabs/verifyTab');

module.exports = { ...addTab, ...getTab, ...deleteTab, ...verifyTab };
