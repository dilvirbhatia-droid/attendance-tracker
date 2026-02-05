// config.js - API Configuration
// Change this to your deployed backend URL

const API_CONFIG = {
    // Development (local)
    development: 'http://localhost:5000',
    
    // Production (replace with your deployed backend URL)
    production: 'angelic-unity-production-16a5.up.railway.app', // Or Railway, Render, etc.
    
    // Current environment
    current: 'production' // Change to 'production' when deploying
};

// Get the base API URL
const getApiUrl = () => {
    return API_CONFIG[API_CONFIG.current];
};

// API endpoints
const API_ENDPOINTS = {
    // Auth
    register: '/api/auth/register',
    loginId: '/api/auth/login/id',
    loginFace: '/api/auth/login/face',
    adminLogin: '/api/auth/admin/login',
    
    // Attendance
    markAttendance: '/api/attendance/mark',
    getHistory: '/api/attendance/history',
    getToday: '/api/attendance/today',
    
    // Admin
    getUsers: '/api/admin/users',
    getDailyReport: '/api/admin/attendance/daily',
    getMonthlyReport: '/api/admin/attendance/monthly',
    getStats: '/api/admin/stats',
    getBackup: '/api/admin/backup',
    
    // Health
    health: '/api/health'
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = getApiUrl() + endpoint;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, API_ENDPOINTS, getApiUrl, apiCall };
}
