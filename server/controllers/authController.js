const { google } = require('googleapis');
const oauth2Client = require('../utils/googleClient');
const User = require('../models/User');

exports.getAuthUrl = (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  res.json({ url });
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const { email, name, picture } = userInfo.data;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        refreshToken: tokens.refresh_token
      });
    } else if (tokens.refresh_token) {
      user.refreshToken = tokens.refresh_token;
      await user.save();
      console.log("🔄 User Token Updated");
    }

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}?auth=success&email=${email}`);

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Login Failed');
  }
};