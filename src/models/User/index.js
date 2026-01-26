const getUser = require('./users/getUser');
const addUser = require('./users/addUser');
const verfyUser = require('./users/verifyUser');

module.exports = { ...getUser, ...addUser, ...verfyUser };
