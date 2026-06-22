# 🔐 Session Store - Login Anywhere

A simple project where users can login once and access their session from anywhere anytime!

## Features ✨

- ✅ **User Registration** - Create new account
- ✅ **User Login** - Login with credentials
- ✅ **Server Sessions** - Active sessions stored on server (24/7)
- ✅ **Login Anywhere** - Access same session from anywhere
- ✅ **Logout** - End session when needed
- ✅ **Session Info** - View session details

## Installation 🚀

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server will run on `http://localhost:3000`

## How to Use 📖

### First Time:
1. Go to **Register** tab
2. Create username & password
3. Click **Register**

### Login:
1. Go to **Login** tab
2. Enter username & password
3. Click **Login**
4. You'll get a **Session ID**

### Access Anywhere:
1. Save your **Session ID** (copy button)
2. Login from any device/browser
3. Your session will be active on server
4. Same session = Same user!

## Project Structure 📁

```
WA/
├── server.js          # Backend (Node.js + Express)
├── public/
│   └── index.html     # Frontend (HTML + CSS + JS)
├── package.json       # Dependencies
├── sessions.json      # Database (auto-created)
└── README.md          # This file
```

## How Sessions Work 🔄

```
User Login
    ↓
Server Creates Session (with ID)
    ↓
Session Stored in JSON Database
    ↓
Session ID Sent to User
    ↓
User Can Access From Anywhere ✨
```

## API Endpoints 🔗

```
POST   /api/login      - Login user
POST   /api/register   - Register new user
GET    /api/session/:id - Check session
POST   /api/logout     - Logout user
GET    /api/sessions   - Get all active sessions
```

## Made by rajugay 💪
