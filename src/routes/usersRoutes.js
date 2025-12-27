const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const UsersController = require('../controllers/users.controller');

const { validate } = require('../middlewares/validate');
const { userSchema } = require('../validator/users.schema');

const router = express.Router();

// /api/users

router
    .route('/')
    .post(validate(userSchema, 'body'), UsersController.postUserController)
    .all(methodNotAllowed(['POST']));

module.exports = router;
