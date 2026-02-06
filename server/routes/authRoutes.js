const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// URL: /auth/url
router.get('/url', authController.getAuthUrl);

// URL: /auth/google/callback
router.get('/google/callback', authController.googleCallback);

module.exports = router;
