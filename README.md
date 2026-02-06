# 🚀 Anapan AI Sales Agent

An intelligent meeting preparation assistant that automatically researches prospects, analyzes their pain points, and generates comprehensive meeting briefs using AI.

## ✨ Features

- **Google Calendar Integration** - Sync upcoming meetings automatically
- **AI-Powered Research** - Uses Gemini AI and web scraping to gather prospect intelligence
- **Smart Analysis** - Identifies pain points, talking points, and strategic tips
- **PDF Export** - Download professional meeting briefs
- **Email Reports** - Send briefs directly to your inbox
- **Manual Entry** - Add meetings manually for instant analysis

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **html2pdf.js** - PDF generation
- **react-hot-toast** - Notifications

### Backend
- **Express.js** - Node.js web framework
- **PostgreSQL** (Neon) - Database
- **Sequelize** - ORM
- **Google APIs** - Calendar & OAuth integration
- **Gemini AI** - Meeting analysis
- **DuckDuckGo Scraper** - Web research
- **Nodemailer** - Email functionality

## 📁 Project Structure

```
ai-meeting-assistant/
├── client/                 # Next.js frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.js    # Main application
│   │       ├── layout.js  # Root layout
│   │       └── globals.css
│   ├── package.json
│   └── next.config.mjs
│
├── server/                 # Express.js backend
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   └── meetingController.js
│   ├── models/
│   │   └── User.js        # User model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── meetingRoutes.js
│   ├── utils/
│   │   ├── agent.js       # AI analysis logic
│   │   ├── emailTransporter.js
│   │   └── googleClient.js
│   ├── index.js           # Server entry point
│   ├── vercel.json        # Vercel config
│   └── package.json
│
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Google Cloud Console project
- Gemini API key
- Gmail account for sending emails

### 1. Clone Repository

```bash
git clone https://github.com/Shreyashgol/ai-meeting-assistant.git
cd ai-meeting-assistant
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:

```env
PORT=8000
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env.local` file in `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Calendar API** and **Google+ API**
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/auth/google/callback`
5. Copy Client ID and Client Secret to `.env`

### 5. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env` as `GEMINI_API_KEY`

### 6. Gmail App Password

1. Enable 2-factor authentication on Gmail
2. Generate App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use this password in `EMAIL_PASS`

### 7. Run Development Servers

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:3000`

## 🚀 Deployment (Vercel)

### Backend Deployment

```bash
cd server
vercel
```

Add environment variables in Vercel Dashboard:
- All variables from `.env`
- Update `GOOGLE_REDIRECT_URI` to `https://your-backend.vercel.app/auth/google/callback`
- Update `FRONTEND_URL` to your frontend URL

### Frontend Deployment

```bash
cd client
vercel
```

Add environment variable:
- `NEXT_PUBLIC_API_URL=https://your-backend.vercel.app`

### Post-Deployment

1. Update Google OAuth redirect URI in Google Cloud Console
2. Test the complete flow

## 📡 API Endpoints

### Authentication
- `GET /auth/url` - Get Google OAuth URL
- `GET /auth/google/callback` - OAuth callback handler

### Meetings
- `GET /api/meetings?email={email}` - Fetch user's calendar meetings
- `POST /api/analyze` - Analyze meeting with AI
  ```json
  { "title": "Meeting with John Doe from Tesla" }
  ```
- `POST /api/send-email` - Send report via email
  ```json
  { "email": "user@example.com", "report": {...} }
  ```

## 🎯 Usage Flow

1. **Sync Calendar** - Click "Sync Calendar" and authorize Google
2. **View Meetings** - See upcoming meetings from your calendar
3. **Add Manual Meeting** - Or add a meeting manually with prospect details
4. **Generate Brief** - Click any meeting to analyze
5. **Review Report** - AI generates comprehensive meeting prep
6. **Export/Email** - Download PDF or email the report

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Regenerate OAuth credentials if exposed
- Use Gmail App Passwords, not account password

## 🐛 Troubleshooting

**404 on API calls:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend is running

**OAuth errors:**
- Verify redirect URI matches exactly in Google Console
- Check Client ID and Secret are correct

**Database connection fails:**
- Verify DATABASE_URL format
- Ensure SSL is enabled for production databases

**Email not sending:**
- Use Gmail App Password, not regular password
- Enable 2FA on Gmail account

## 📝 License

MIT

## 👤 Author

Shreyash Golhani

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.
