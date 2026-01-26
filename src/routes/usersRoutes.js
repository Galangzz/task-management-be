const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const { userSchema, verifyRegister, verifyResendOtp } = require('../validator/usersSchema');
const UsersController = require('../controllers/usersController');

const router = express.Router();

// /api/users

router
    .route('/signup')
    .post(validate(userSchema, 'body'), asyncHandler(UsersController.signupUserController))
    .all(methodNotAllowed(['POST']));

router
    .route('/verify-signup')
    .post(validate(verifyRegister, 'body'), asyncHandler(UsersController.verifyOTPController))
    .all(methodNotAllowed(['POST']));

router
    .route('/resend-otp')
    .post(validate(verifyResendOtp, 'body'), asyncHandler(UsersController.resendOTPController))
    .all(methodNotAllowed(['POST']));

module.exports = router;
