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
app.use('/auth', authRoutes); // Auth related URLs '/auth' se shuru honge
app.use('/', meetingRoutes);  // Meeting related direct root pe hain (ya '/api' bhi laga sakte ho)

app.get('/', (req, res) => {
  res.send('🚀 Anapan AI Server is Running (MVC Structure)');
});

// Local testing ke liye listen rakho, lekin export zaroori hai
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// 👇 Vercel ke liye ye line sabse important hai
module.exports = app;