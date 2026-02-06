const { google } = require('googleapis');
const oauth2Client = require('../utils/googleClient');
const User = require('../models/User'); // Ensure model exists

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

    // Get User Info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    // Save/Update User in DB
    let user = await User.findOne({ email: userInfo.data.email });

    if (!user) {
      user = new User({
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
        refreshToken: tokens.refresh_token
      });
      await user.save();
    } else if (tokens.refresh_token) {
      user.refreshToken = tokens.refresh_token;
      await user.save();
    }

    // Redirect to Frontend
    // Note: Production mein Env variable use karna better hai
    res.redirect(`http://localhost:3000?auth=success&email=${user.email}`);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Login Failed');
  }
};