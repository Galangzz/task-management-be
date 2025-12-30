const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const authHandler = require('../middlewares/authHandler');

const { postAuthSchema, putAuthSchema, deleteAuthSchema } = require('../validator/authSchema');
const AuthController = require('../controllers/authController');

const router = express.Router();

// /api/auth
router
    .route('/login')
    .post(validate(postAuthSchema, 'body'), AuthController.postAuthController)
    .all(methodNotAllowed(['POST']));

router
    .route('/refresh')
    .get(validate(putAuthSchema, 'cookies'), AuthController.getNewAccessToken)
    .all(methodNotAllowed(['GET']));

router
    .route('/logout')
    .delete(authHandler, AuthController.deleteAuthController)
    .all(methodNotAllowed(['DELETE']));

router
    .route('/me')
    .get(authHandler, AuthController.getMe)
    .all(methodNotAllowed(['GET']));

module.exports = router;
