// server/controllers/meetingController.js
const { google } = require('googleapis');
const oauth2Client = require('../utils/googleClient');
const { generateMeetingPrep } = require('../utils/agent');
const transporter = require('../utils/emailTransporter');
const User = require('../models/User'); // 👇 User Model Import zaroori hai

// 1. Get Meetings
exports.getMeetings = async (req, res) => {
  try {
    // 👇 Frontend se email lo
    const { email } = req.query; 

    if (!email) {
      console.log("⚠️ No email provided in request");
      return res.json([]); // Agar email nahi bheja toh empty list do
    }

    // 👇 Database se User dhoondo (PostgreSQL/Sequelize syntax)
    const user = await User.findOne({ where: { email } });

    if (!user || !user.refreshToken) {
      console.log("⚠️ User not found or no Refresh Token");
      return res.json([]); 
    }

    // 👇 MAGIC STEP: Token Set karo
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Ab Calendar fetch karo
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nextWeek.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const meetings = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      startTime: event.start.dateTime || event.start.date,
      description: event.description
    }));

    res.json(meetings);

  } catch (error) {
    console.error('Calendar Fetch Error:', error.message);
    res.json([]); 
  }
};

// ... Baaki functions (analyzeMeeting, sendEmail) same rahenge ...
// Unhe change mat karna
exports.analyzeMeeting = async (req, res) => { /* ... purana code ... */ };
exports.sendEmail = async (req, res) => { /* ... purana code ... */ };