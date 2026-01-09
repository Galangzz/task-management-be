const express = require('express');
const { rateLimit } = require('express-rate-limit');

const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const authHandler = require('../middlewares/authHandler');
const asyncHandler = require('../middlewares/asyncHandler');
const { postAuthSchema, putAuthSchema, deleteAuthSchema } = require('../validator/authSchema');
const AuthController = require('../controllers/authController');

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    message: 'Terlalu banyak percobaan login, silakan coba lagi nanti.',
    standardHeaders: true,
    legacyHeaders: false,
    // skip: (req) => req.method === 'OPTIONS',
});

const router = express.Router();

// /api/auth
router
    .route('/login')
    .post(loginLimiter, validate(postAuthSchema, 'body'), asyncHandler(AuthController.postAuthController))
    .all(methodNotAllowed(['POST']));

router
    .route('/refresh')
    .get(validate(putAuthSchema, 'cookies'), AuthController.getNewAccessToken)
    .all(methodNotAllowed(['GET']));

router
    .route('/logout')
    .delete(authHandler, asyncHandler(AuthController.deleteAuthController))
    .all(methodNotAllowed(['DELETE']));

router
    .route('/me')
    .get(authHandler, asyncHandler(AuthController.getMe))
    .all(methodNotAllowed(['GET']));

module.exports = router;
