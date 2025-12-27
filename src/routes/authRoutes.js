const express = require('express');
const methodNotAllowed = require('../middlewares/methdoNotAllowedHandler');

const router = express.Router();

// /api/auth
router.post('/login');

