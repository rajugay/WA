const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Database file path
const DB_PATH = path.join(__dirname, 'sessions.json');

// Read database
function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return { users: {}, sessions: {} };
    }
}

// Write database
function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Login endpoint
app.post('/login', (req, res) => {
    const { phone, password } = req.body;
    const db = readDB();
    
    if (!phone || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone and password required' 
        });
    }
    
    // Check credentials
    if (db.users[phone] && db.users[phone].password === password) {
        res.json({
            success: true,
            session: db.sessions[phone] || null,
            message: 'Login successful!'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials! Demo: 9876543210 / admin123'
        });
    }
});

// Save session endpoint
app.post('/save-session', (req, res) => {
    const { phone, password, sessionData } = req.body;
    const db = readDB();
    
    db.users[phone] = { password, session: sessionData };
    db.sessions[phone] = sessionData;
    writeDB(db);
    
    res.json({ success: true, message: 'Session saved!' });
});

// Health check for keep-alive
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Demo users
app.get('/demo-users', (req, res) => {
    const db = readDB();
    res.json({ 
        users: Object.keys(db.users),
        message: 'Use phone number + password to login'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Demo credentials: 9876543210 / admin123`);
});
