# 📊 Attendance Tracker System

A modern, browser-based attendance management system with face recognition and comprehensive admin dashboard.

## 🌟 Features

- **Dual Authentication**: Face recognition or Employee ID/Password login
- **4-Session Tracking**: Morning, Lunch, Post-Lunch, Evening check-ins
- **Admin Dashboard**: Daily and monthly attendance reports
- **Data Management**: Built-in backup and restore functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Privacy-First**: All data stored locally in browser (no server required)

## 📁 Project Structure

```
attendance-tracker/
├── index.html                    # Landing page
├── attendance-app-face.html      # Employee portal
├── admin-dashboard.html          # Admin dashboard
├── backup-utility.html           # Data backup tool
└── README.md                     # This file
```

## 🚀 Deployment Options

### Option 1: GitHub Pages (FREE) ⭐ Recommended

1. **Create a GitHub Repository**
   - Go to https://github.com/new
   - Name: `attendance-tracker` (or any name)
   - Make it Public
   - Click "Create repository"

2. **Upload Files**
   - Click "uploading an existing file"
   - Drag and drop all 4 HTML files
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` → `/root`
   - Click Save

4. **Access Your Site**
   - URL: `https://yourusername.github.io/attendance-tracker/`
   - Wait 1-2 minutes for deployment

### Option 2: Netlify (FREE)

1. **Sign Up**
   - Go to https://www.netlify.com/
   - Sign up with GitHub/Email

2. **Deploy**
   - Drag and drop all HTML files into Netlify
   - Or connect GitHub repo
   - Site deployed instantly!

3. **Custom Domain** (Optional)
   - Settings → Domain management
   - Add custom domain

### Option 3: Vercel (FREE)

1. **Sign Up**
   - Go to https://vercel.com/
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - Deploy!

3. **Access**
   - Get instant URL: `your-project.vercel.app`

### Option 4: Firebase Hosting (FREE)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```

### Option 5: Cloudflare Pages (FREE)

1. **Sign Up**: https://pages.cloudflare.com/
2. **Connect Git** or drag-drop files
3. **Deploy** - instant deployment
4. **Free SSL** included

### Option 6: Traditional Web Hosting

Upload all 4 HTML files to any web hosting via:
- FTP/SFTP
- cPanel File Manager
- Hosting control panel

## 🔧 Configuration

### Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`
- Change in `admin-dashboard.html` (line 1096)

### Customization
All files are standalone HTML with embedded CSS/JS:
- Colors: Search for `#667eea` and `#764ba2`
- Text: Edit directly in HTML
- Features: Modify JavaScript sections

## 📱 Usage

### For Employees
1. Visit the site
2. Click "Employee Portal"
3. Register with face or ID
4. Mark attendance 4 times daily

### For Admins
1. Click "Admin Dashboard"
2. Login (admin/admin123)
3. View reports & export data

### Data Backup
1. Click "Backup Utility"
2. Backup data regularly
3. Restore when needed

## 🔒 Privacy & Security

- **Local Storage**: All data in browser localStorage
- **No Server**: No data sent to external servers
- **Face Data**: Stored as base64 in browser only
- **Passwords**: Basic encoding (upgrade for production)

### For Production Use
Consider adding:
1. Server-side storage (database)
2. Proper password hashing (bcrypt)
3. Real face recognition library (face-api.js)
4. User authentication backend
5. HTTPS enforcement
6. Rate limiting
7. Data encryption

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Requires camera permission for face recognition

## 📦 Data Storage

### localStorage Keys
- `registeredUsers`: All user profiles
- `attendance_<employeeId>`: Individual attendance records
- `attendanceUser`: Current session user
- `adminAuth`: Admin login status

### Backup Format
JSON file containing all user and attendance data

## 🆘 Troubleshooting

### Camera Not Working
- Grant camera permissions in browser
- Use ID/Password login instead
- Check HTTPS (required for camera)

### Data Not Saving
- Check browser localStorage enabled
- Clear browser cache
- Try different browser

### Can't Access Admin
- Default: admin/admin123
- Check console for errors
- Clear localStorage and retry

## 🔄 Updates

To update your deployed site:
1. Edit HTML files
2. Re-upload to hosting
3. Clear browser cache
4. Refresh page

## 📊 Storage Limits

- **localStorage**: ~5-10MB per domain
- **Face images**: ~50-100KB each
- **Typical capacity**: 50-100 users with face data

## 🎨 Customization Tips

### Change Colors
Search and replace:
- Primary: `#667eea` → your color
- Secondary: `#764ba2` → your color

### Add Logo
Add to header sections:
```html
<img src="logo.png" alt="Logo" style="height: 50px;">
```

### Modify Sessions
Edit in `attendance-app-face.html`:
- Session names
- Time ranges
- Number of sessions

## 📝 License

Free to use for personal and commercial projects.

## 🤝 Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage enabled
3. Test in incognito mode
4. Try different browser

## 🚀 Quick Deploy Commands

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/attendance-tracker.git
git push -u origin main
```

### Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

---

**Ready to deploy?** Choose your hosting platform and follow the steps above! 🎉

**Live in minutes!** All platforms offer free hosting with instant deployment.

**Need help?** All platforms have excellent documentation and support.
