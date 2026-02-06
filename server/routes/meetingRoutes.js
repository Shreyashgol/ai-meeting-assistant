const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

router.get('/meetings', meetingController.getMeetings);
router.post('/analyze', meetingController.analyzeMeeting);
router.post('/send-email', meetingController.sendEmail);

module.exports = router;