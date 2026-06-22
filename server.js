const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DB_PATH = path.join(__dirname, 'sessions.json');

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return { users: {}, sessions: {} };
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.post('/login', (req, res) => {
    const { phone, password } = req.body;
    const db = readDB();
    
    if (!phone || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone and password required' 
        });
    }
    
    // Validate phone format (digits only)
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Phone number must be 10 digits'
        });
    }
    
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

app.post('/save-session', (req, res) => {
    const { phone, password, sessionData } = req.body;
    const db = readDB();
    
    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid phone number'
        });
    }
    
    db.users[phone] = { password, session: sessionData };
    db.sessions[phone] = sessionData;
    writeDB(db);
    
    res.json({ success: true, message: 'Session saved!' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Demo: 9876543210 / admin123`);
});
