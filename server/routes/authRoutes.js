const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/url', authController.getAuthUrl);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
