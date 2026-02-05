// server.js - Backend Server for Attendance System
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for face images
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public')); // Serve frontend files

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-system';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    password: { type: String }, // For ID-based login
    faceData: { type: String }, // Base64 encoded face image
    loginMethod: { type: String, enum: ['face', 'id'], required: true },
    role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
    registeredAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD format
    sessions: {
        morning: { type: Date },
        lunch: { type: Date },
        post: { type: Date },
        evening: { type: Date }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index for faster queries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ==================== AUTH ROUTES ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, employeeId, password, faceData, loginMethod } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { employeeId }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this email or employee ID already exists' 
            });
        }

        // Create user object
        const userData = {
            name,
            email,
            employeeId,
            loginMethod,
            faceData: loginMethod === 'face' ? faceData : null
        };

        // Hash password if ID-based login
        if (loginMethod === 'id' && password) {
            userData.password = await bcrypt.hash(password, 10);
        }

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                employeeId: user.employeeId,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId,
                loginMethod: user.loginMethod,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login with Employee ID and Password
app.post('/api/auth/login/id', async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        const user = await User.findOne({ employeeId, isActive: true });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.loginMethod !== 'id' || !user.password) {
            return res.status(400).json({ 
                error: 'This account uses face recognition login' 
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                employeeId: user.employeeId,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId,
                loginMethod: user.loginMethod,
                role: user.role,
                faceData: user.faceData
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Login with Face Recognition
app.post('/api/auth/login/face', async (req, res) => {
    try {
        const { faceData } = req.body;

        // In production, use proper face recognition library
        // This is a simplified comparison
        const user = await User.findOne({ 
            faceData, 
            loginMethod: 'face',
            isActive: true 
        });

        if (!user) {
            return res.status(401).json({ 
                error: 'Face not recognized. Please try again or use ID login.' 
            });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                employeeId: user.employeeId,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                employeeId: user.employeeId,
                loginMethod: user.loginMethod,
                role: user.role,
                faceData: user.faceData
            }
        });

    } catch (error) {
        console.error('Face login error:', error);
        res.status(500).json({ error: 'Face login failed' });
    }
});

// Admin login
app.post('/api/auth/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // For simplicity, using hardcoded admin credentials
        // In production, store admin in database
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign(
                { userId: 'admin', role: 'admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Admin login successful',
                token,
                user: { username: 'admin', role: 'admin' }
            });
        } else {
            res.status(401).json({ error: 'Invalid admin credentials' });
        }

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Admin login failed' });
    }
});

// ==================== ATTENDANCE ROUTES ====================

// Mark attendance
app.post('/api/attendance/mark', authenticateToken, async (req, res) => {
    try {
        const { date, session } = req.body;
        const { employeeId } = req.user;

        if (!['morning', 'lunch', 'post', 'evening'].includes(session)) {
            return res.status(400).json({ error: 'Invalid session' });
        }

        // Find or create attendance record for the date
        let attendance = await Attendance.findOne({ employeeId, date });

        if (!attendance) {
            attendance = new Attendance({
                employeeId,
                date,
                sessions: {}
            });
        }

        // Check if already marked
        if (attendance.sessions[session]) {
            return res.status(400).json({ 
                error: 'Already checked in for this session' 
            });
        }

        // Mark attendance
        attendance.sessions[session] = new Date();
        attendance.updatedAt = new Date();
        await attendance.save();

        res.json({
            message: 'Attendance marked successfully',
            attendance: {
                date: attendance.date,
                sessions: attendance.sessions
            }
        });

    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
});

// Get user's attendance history
app.get('/api/attendance/history', authenticateToken, async (req, res) => {
    try {
        const { employeeId } = req.user;
        const { startDate, endDate, limit = 30 } = req.query;

        const query = { employeeId };
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }

        const attendance = await Attendance.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.json({ attendance });

    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch attendance history' });
    }
});

// Get today's attendance status
app.get('/api/attendance/today', authenticateToken, async (req, res) => {
    try {
        const { employeeId } = req.user;
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({ employeeId, date: today });

        res.json({
            date: today,
            sessions: attendance ? attendance.sessions : {},
            completedCount: attendance ? Object.keys(attendance.sessions).length : 0
        });

    } catch (error) {
        console.error('Get today error:', error);
        res.status(500).json({ error: 'Failed to fetch today\'s attendance' });
    }
});

// ==================== ADMIN ROUTES ====================

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'employee' })
            .select('-password')
            .sort({ registeredAt: -1 });

        res.json({ users });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get daily attendance report (admin only)
app.get('/api/admin/attendance/daily', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const attendanceRecords = await Attendance.find({ date: targetDate });
        const users = await User.find({ role: 'employee' });

        const report = users.map(user => {
            const attendance = attendanceRecords.find(a => a.employeeId === user.employeeId);
            const sessions = attendance ? attendance.sessions : {};
            const sessionCount = Object.keys(sessions).length;

            return {
                employeeId: user.employeeId,
                name: user.name,
                email: user.email,
                sessions,
                sessionCount,
                status: sessionCount === 4 ? 'full' : sessionCount > 0 ? 'partial' : 'absent'
            };
        });

        res.json({ date: targetDate, report });

    } catch (error) {
        console.error('Daily report error:', error);
        res.status(500).json({ error: 'Failed to generate daily report' });
    }
});

// Get monthly attendance report (admin only)
app.get('/api/admin/attendance/monthly', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { year, month } = req.query;
        const targetYear = year || new Date().getFullYear();
        const targetMonth = month || (new Date().getMonth() + 1);

        // Get date range for the month
        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${lastDay}`;

        const attendanceRecords = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        });

        const users = await User.find({ role: 'employee' });

        const report = users.map(user => {
            const userAttendance = attendanceRecords.filter(a => a.employeeId === user.employeeId);
            
            let fullDays = 0;
            let partialDays = 0;
            let absentDays = 0;

            // Count attendance for each day of the month
            for (let day = 1; day <= lastDay; day++) {
                const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayAttendance = userAttendance.find(a => a.date === dateStr);
                
                if (dayAttendance) {
                    const sessionCount = Object.keys(dayAttendance.sessions).length;
                    if (sessionCount === 4) fullDays++;
                    else partialDays++;
                } else {
                    absentDays++;
                }
            }

            const attendancePercentage = ((fullDays / lastDay) * 100).toFixed(2);

            return {
                employeeId: user.employeeId,
                name: user.name,
                email: user.email,
                totalDays: lastDay,
                presentDays: fullDays,
                partialDays,
                absentDays,
                attendancePercentage
            };
        });

        res.json({ 
            year: targetYear, 
            month: targetMonth, 
            report 
        });

    } catch (error) {
        console.error('Monthly report error:', error);
        res.status(500).json({ error: 'Failed to generate monthly report' });
    }
});

// Get dashboard statistics (admin only)
app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });
        
        const todayAttendance = await Attendance.find({ date: today });
        const presentToday = todayAttendance.filter(a => Object.keys(a.sessions).length === 4).length;

        // Get monthly stats
        const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(currentYear, currentMonth, 0).getDate();
        const endDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${lastDay}`;

        const monthlyAttendance = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        });

        const fullAttendanceDays = monthlyAttendance.filter(a => 
            Object.keys(a.sessions).length === 4
        ).length;

        const monthAverage = totalEmployees > 0 
            ? ((fullAttendanceDays / (totalEmployees * lastDay)) * 100).toFixed(2)
            : 0;

        const complianceRate = totalEmployees > 0 
            ? ((presentToday / totalEmployees) * 100).toFixed(2)
            : 0;

        res.json({
            totalEmployees,
            presentToday,
            monthAverage: `${monthAverage}%`,
            complianceRate: `${complianceRate}%`
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Export data backup (admin only)
app.get('/api/admin/backup', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const attendance = await Attendance.find();

        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                users,
                attendance
            }
        };

        res.json(backup);

    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Failed to create backup' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Attendance System API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✓ Server running on port ${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health\n`);
});
