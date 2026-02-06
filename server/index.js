require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes Mounting
app.use('/auth', authRoutes);
app.use('/api', meetingRoutes); // Changed to /api prefix

// Root endpoint for health check
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

// Local testing ke liye listen rakho, lekin export zaroori hai
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// 👇 Vercel ke liye ye line sabse important hai
module.exports = app;