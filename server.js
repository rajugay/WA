const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'sessions.json');

// Read database
function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return { users: {}, activeSessions: {} };
    }
}

// Write database
function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Initialize database
function initDB() {
    if (!fs.existsSync(DB_PATH)) {
        writeDB({ users: {}, activeSessions: {} });
    }
}

initDB();

// Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password required'
        });
    }

    // Check if user exists
    if (db.users[username] && db.users[username].password === password) {
        // Create session
        const sessionId = Date.now().toString();
        db.activeSessions[sessionId] = {
            username: username,
            loginTime: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            active: true
        };
        writeDB(db);

        res.json({
            success: true,
            sessionId: sessionId,
            message: 'Login successful!'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials!'
        });
    }
});

// Register Route
app.post('/api/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const db = readDB();

    if (!username || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'All fields required'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        });
    }

    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Username must be at least 3 characters'
        });
    }

    if (db.users[username]) {
        return res.status(400).json({
            success: false,
            message: 'Username already exists'
        });
    }

    // Create user
    db.users[username] = {
        password: password,
        createdAt: new Date().toISOString()
    };
    writeDB(db);

    res.json({
        success: true,
        message: 'Registration successful! Please login.'
    });
});

// Get Session Info
app.get('/api/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const db = readDB();

    const session = db.activeSessions[sessionId];
    if (session && session.active) {
        // Update last active
        session.lastActive = new Date().toISOString();
        writeDB(db);

        res.json({
            success: true,
            session: session
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Session expired or invalid'
        });
    }
});

// Logout Route
app.post('/api/logout', (req, res) => {
    const { sessionId } = req.body;
    const db = readDB();

    if (db.activeSessions[sessionId]) {
        db.activeSessions[sessionId].active = false;
        writeDB(db);
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Session not found'
        });
    }
});

// Get all active sessions (for admin/debug)
app.get('/api/sessions', (req, res) => {
    const db = readDB();
    const activeSessions = Object.values(db.activeSessions).filter(s => s.active);
    res.json({
        activeSessions: activeSessions,
        total: activeSessions.length
    });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Session Store - Login Anywhere\n`);
});
