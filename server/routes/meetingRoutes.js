const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// URL: /meetings
router.get('/', meetingController.getMeetings);

// URL: /analyze
router.post('/analyze', meetingController.analyzeMeeting);

// URL: /send-email
router.post('/send-email', meetingController.sendEmail);

module.exports = router;