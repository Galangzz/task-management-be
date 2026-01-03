const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const UsersController = require('../controllers/usersController');

const { validate } = require('../middlewares/validate');
const { userSchema, verifyRegister, verifyResendOtp } = require('../validator/usersSchema');

const router = express.Router();

// /api/users

router
    .route('/signup')
    .post(validate(userSchema, 'body'), UsersController.signupUserController)
    .all(methodNotAllowed(['POST']));

router
    .route('/verify-signup')
    .post(validate(verifyRegister, 'body'), UsersController.verifyOTPController)
    .all(methodNotAllowed(['POST']));

router
    .route('/resend-otp')
    .post(validate(verifyResendOtp, 'body'), UsersController.resendOTPController)
    .all(methodNotAllowed(['POST']));

module.exports = router;
