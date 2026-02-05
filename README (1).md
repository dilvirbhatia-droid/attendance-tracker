# 🌐 Attendance System - Backend Server

Online database storage for the Attendance Tracker System using MongoDB and Express.js

## 🎯 What This Does

Converts the attendance system from browser localStorage to a **real online database** that:
- ✅ Stores data in MongoDB (cloud database)
- ✅ Allows multiple users to access same data
- ✅ Provides REST API for frontend
- ✅ Includes JWT authentication
- ✅ Works from any device

---

## 📁 Project Structure

```
backend/
├── server.js                  # Main Express server
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── BACKEND_DEPLOYMENT.md     # Detailed deployment guide
├── README.md                 # This file
└── public/
    ├── config.js             # Frontend API configuration
    └── *.html                # Frontend files
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=change-this-to-random-secret-key
PORT=5000
NODE_ENV=development
```

### 3. Start Server
```bash
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

### 4. Test API
Open browser: http://localhost:5000/api/health

Should see:
```json
{
  "status": "OK",
  "message": "Attendance System API is running",
  "timestamp": "2025-02-04T..."
}
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/attendance-system`

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster
3. Get connection string
4. Update `.env` file

**Detailed instructions in BACKEND_DEPLOYMENT.md**

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login/id          Login with employee ID
POST   /api/auth/login/face        Login with face recognition
POST   /api/auth/admin/login       Admin login
```

### Attendance (Requires Auth Token)
```
POST   /api/attendance/mark        Mark attendance
GET    /api/attendance/history     Get attendance history
GET    /api/attendance/today       Get today's attendance
```

### Admin (Requires Admin Token)
```
GET    /api/admin/users            Get all users
GET    /api/admin/attendance/daily Get daily report
GET    /api/admin/attendance/monthly Get monthly report
GET    /api/admin/stats            Get dashboard statistics
GET    /api/admin/backup           Export backup
```

### System
```
GET    /api/health                 Health check
```

---

## 🔐 Authentication

Uses JWT (JSON Web Tokens):

1. Register or login → Receive token
2. Store token in localStorage
3. Include in requests: `Authorization: Bearer <token>`
4. Token expires after 7 days (configurable)

Example:
```javascript
const response = await fetch('http://localhost:5000/api/attendance/mark', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    date: '2025-02-04',
    session: 'morning'
  })
});
```

---

## 📦 Dependencies

```json
{
  "express": "Web server framework",
  "mongoose": "MongoDB object modeling",
  "cors": "Cross-origin resource sharing",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "dotenv": "Environment variables"
}
```

---

## 🚀 Deployment

### Recommended Platforms:

1. **Railway** (Easiest)
   - Free $5/month credit
   - Auto-deploy from GitHub
   - Simple environment variables
   - https://railway.app/

2. **Render**
   - Free tier available
   - Auto-deploy
   - Good documentation
   - https://render.com/

3. **Heroku**
   - Eco dyno ($5/month)
   - Mature platform
   - https://heroku.com/

**Complete deployment guide: BACKEND_DEPLOYMENT.md**

---

## 🔄 Frontend Integration

### Update config.js:

```javascript
const API_CONFIG = {
  production: 'https://your-backend-url.railway.app',
  current: 'production'
};
```

### Include in HTML:
```html
<script src="config.js"></script>
```

### Make API calls:
```javascript
// Example: Register user
const data = await apiCall(API_ENDPOINTS.register, {
  method: 'POST',
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    employeeId: 'EMP001',
    password: 'password123',
    loginMethod: 'id'
  })
});

// Store token
localStorage.setItem('authToken', data.token);
```

---

## 🧪 Testing

### Manual Testing:

1. Start server: `npm start`
2. Use Postman or curl
3. Test endpoints

### Example curl commands:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "employeeId": "EMP001",
    "password": "password123",
    "loginMethod": "id"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login/id \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "password": "password123"
  }'
```

---

## 🔒 Security Considerations

### Implemented:
✅ Password hashing with bcrypt
✅ JWT token authentication
✅ CORS protection
✅ Environment variables for secrets
✅ Input validation

### Production Recommendations:
- Use strong JWT_SECRET (random 256-bit string)
- Enable HTTPS (automatic on hosting platforms)
- Implement rate limiting (express-rate-limit)
- Add helmet.js for security headers
- Validate all inputs
- Implement proper error handling
- Use real face recognition library (face-api.js)
- Set up monitoring and logging

---

## 📊 Database Schema

### Users Collection:
```javascript
{
  name: String,
  email: String (unique),
  employeeId: String (unique),
  password: String (hashed),
  faceData: String (base64),
  loginMethod: String ('face' | 'id'),
  role: String ('employee' | 'admin'),
  registeredAt: Date,
  isActive: Boolean
}
```

### Attendances Collection:
```javascript
{
  employeeId: String,
  date: String (YYYY-MM-DD),
  sessions: {
    morning: Date,
    lunch: Date,
    post: Date,
    evening: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🆘 Troubleshooting

### Server won't start:
- Check Node.js installed: `node --version`
- Check MongoDB connection string
- Verify port 5000 is available
- Check error logs

### Database connection failed:
- MongoDB running? `mongod` or check Atlas
- Connection string correct?
- IP whitelisted in MongoDB Atlas?
- Network/firewall issues?

### CORS errors:
- Backend and frontend on different domains?
- CORS enabled in server.js (it is by default)
- Check browser console

### Token errors:
- JWT_SECRET set in .env?
- Token expired? (re-login)
- Token format correct? `Bearer <token>`

---

## 📈 Performance

### Optimization Tips:
- Add database indexes (already included)
- Implement caching (Redis)
- Use connection pooling
- Compress responses (gzip)
- Rate limit requests
- Monitor with PM2 or similar

---

## 🔄 Updates

### To add new features:

1. Update schema in `server.js`
2. Add new routes/endpoints
3. Update API documentation
4. Update frontend to use new endpoints
5. Test thoroughly
6. Deploy

---

## 📞 Support

For issues:
1. Check BACKEND_DEPLOYMENT.md
2. Review error logs
3. Check MongoDB connection
4. Verify environment variables
5. Test with curl/Postman

---

## 📝 License

MIT License - Free to use for personal and commercial projects

---

## 🎉 Ready to Deploy!

Follow the steps in **BACKEND_DEPLOYMENT.md** for complete deployment instructions.

**Estimated setup time:** 15-30 minutes

**Cost:** FREE (using free tiers of MongoDB Atlas + Railway/Render)

**Result:** Professional attendance system with online database! 🚀
