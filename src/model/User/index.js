const addUser = require('./users/addUser');
const verfyUser = require('./users/verifyUser');

module.exports = { ...addUser, ...verfyUser };
