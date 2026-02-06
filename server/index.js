require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/auth', authRoutes);
app.use('/api', meetingRoutes);

app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: '🚀 Anapan AI Server is Running (MVC Structure)',
    endpoints: {
      auth: '/auth/url, /auth/google/callback',
      meetings: '/api/meetings',
      analyze: '/api/analyze',
      email: '/api/send-email'
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;