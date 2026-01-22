const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');

const { postTokenSchema } = require('../validator/notificationsSchema');
const NotificationsController = require('../controllers/notificationsController');

const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router
    .route('/token')
    .post(validate(postTokenSchema, 'body'), asyncHandler(NotificationsController.postNotificationsToken))
    .all(methodNotAllowed(['POST']));

module.exports = router;