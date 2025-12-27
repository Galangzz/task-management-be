const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');
const { validate } = require('../middlewares/validate');
const { postAuthSchema, putAuthSchema, deleteAuthSchema } = require('../validator/authSchema');
const AuthController = require('../controllers/authController');

const router = express.Router();

// /api/auth
router
    .route('/')
    .post(validate(postAuthSchema, 'body'), AuthController.postAuthController)
    .put(validate(putAuthSchema, 'cookies'), AuthController.putAuthController)
    .delete(validate(deleteAuthSchema, 'cookies'), AuthController.deleteAuthController)
    .all(methodNotAllowed(['POST', 'PUT', 'DELETE']));

module.exports = router;
