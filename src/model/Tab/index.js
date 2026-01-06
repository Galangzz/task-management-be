const addTab = require('./tabs/addTab');
const getTab = require('./tabs/getTab');
const verifyTab = require('./tabs/verifyTab');

module.exports = { ...addTab, ...getTab, ...verifyTab };
