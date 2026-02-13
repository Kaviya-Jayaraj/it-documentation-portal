# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install MongoDB
Download and install MongoDB from: https://www.mongodb.com/try/download/community

### 2. Run Setup Script
Double-click `setup.bat` to install all dependencies automatically.

### 3. Start MongoDB
MongoDB should start automatically. If not, run:
```bash
mongod
```

### 4. Create Admin User
Open MongoDB shell and run:
```bash
mongo
use it_documentation_portal
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
exit
```

### 5. Start Backend Server
```bash
cd backend
npm start
```

### 6. Open Frontend
Open `frontend/login.html` in your browser or use Live Server in VS Code.

### 7. Login
- **Email:** admin@example.com
- **Password:** admin123

## 📝 Default Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**User Account:**
- Email: user@example.com
- Password: admin123

## ⚠️ Important Notes

- Backend must be running on port 5000
- MongoDB must be running
- Use Live Server for best experience
- Change default passwords in production

## 🆘 Need Help?

Check the full README.md for detailed instructions and troubleshooting.
