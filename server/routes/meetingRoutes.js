const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// URL: /api/meetings
router.get('/meetings', meetingController.getMeetings);

// URL: /api/analyze
router.post('/analyze', meetingController.analyzeMeeting);

// URL: /api/send-email
router.post('/send-email', meetingController.sendEmail);

module.exports = router;