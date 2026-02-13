# Troubleshooting Guide

## Common Issues and Solutions

### 1. MongoDB Connection Issues

#### Problem: "MongoDB connection error"
**Symptoms:**
- Backend fails to start
- Error message: "MongoNetworkError" or "ECONNREFUSED"

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Or check services
   services.msc → Look for MongoDB
   ```

2. Verify MongoDB is listening on port 27017:
   ```bash
   netstat -an | findstr 27017
   ```

3. Check MongoDB URI in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/it_documentation_portal
   ```

4. Try connecting manually:
   ```bash
   mongo
   ```

---

### 2. Backend Server Issues

#### Problem: "Port 5000 already in use"
**Symptoms:**
- Error: "EADDRINUSE: address already in use :::5000"

**Solutions:**
1. Change port in `.env`:
   ```
   PORT=5001
   ```

2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

#### Problem: "Cannot find module"
**Symptoms:**
- Error: "Cannot find module 'express'" or similar

**Solutions:**
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Delete node_modules and reinstall:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

---

### 3. Authentication Issues

#### Problem: "Not authorized, no token"
**Symptoms:**
- Cannot access protected routes
- Redirected to login page

**Solutions:**
1. Check if token exists in localStorage:
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Look for 'token' key

2. Clear localStorage and login again:
   ```javascript
   localStorage.clear()
   ```

3. Check if token is being sent in headers:
   - Open DevTools → Network tab
   - Check request headers for "Authorization: Bearer <token>"

#### Problem: "Invalid credentials"
**Symptoms:**
- Cannot login with correct credentials

**Solutions:**
1. Verify user exists in database:
   ```javascript
   mongo
   use it_documentation_portal
   db.users.find({ email: "admin@example.com" })
   ```

2. Recreate admin user:
   ```javascript
   db.users.deleteOne({ email: "admin@example.com" })
   db.users.insertOne({
     name: "Admin User",
     email: "admin@example.com",
     password: "$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS",
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

---

### 4. File Upload Issues

#### Problem: "Only PDF, DOCX, and TXT files are allowed"
**Symptoms:**
- Cannot upload valid file types

**Solutions:**
1. Check file extension (must be lowercase in some cases)
2. Verify file is not corrupted
3. Check file size (max 10MB)

#### Problem: "File upload failed"
**Symptoms:**
- Upload button doesn't work
- No error message

**Solutions:**
1. Check if uploads folder exists:
   ```bash
   cd backend
   dir uploads
   ```

2. Create uploads folder if missing:
   ```bash
   mkdir uploads
   ```

3. Check folder permissions (should be writable)

#### Problem: "Cannot download file"
**Symptoms:**
- Download button doesn't work
- 404 error

**Solutions:**
1. Check if file exists in uploads folder
2. Verify file path in database matches actual file
3. Check backend logs for errors

---

### 5. CORS Issues

#### Problem: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Symptoms:**
- Frontend cannot connect to backend
- Network errors in browser console

**Solutions:**
1. Verify CORS is enabled in server.js:
   ```javascript
   app.use(cors());
   ```

2. Check backend is running on correct port (5000)

3. Verify API_URL in frontend JS files:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

---

### 6. Frontend Issues

#### Problem: "Cannot read property of undefined"
**Symptoms:**
- JavaScript errors in console
- Page doesn't load properly

**Solutions:**
1. Check browser console for specific errors (F12)
2. Verify API responses are correct
3. Check if data structure matches expected format

#### Problem: "Login redirects to wrong page"
**Symptoms:**
- Admin goes to user page or vice versa

**Solutions:**
1. Check user role in localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('user')).role
   ```

2. Verify role is set correctly in database

#### Problem: "Search not working"
**Symptoms:**
- Search returns no results
- Search doesn't filter documents

**Solutions:**
1. Check if search query is being sent to backend
2. Verify backend search endpoint is working
3. Check network tab for API response

---

### 7. Database Issues

#### Problem: "Duplicate key error"
**Symptoms:**
- Cannot create user with existing email
- Error: "E11000 duplicate key error"

**Solutions:**
1. This is expected behavior (email must be unique)
2. Use different email address
3. Or delete existing user:
   ```javascript
   db.users.deleteOne({ email: "user@example.com" })
   ```

#### Problem: "Validation error"
**Symptoms:**
- Cannot save document
- Missing required fields

**Solutions:**
1. Check all required fields are filled
2. Verify data types match schema
3. Check backend logs for specific validation errors

---

### 8. Installation Issues

#### Problem: "npm install fails"
**Symptoms:**
- Errors during npm install
- Missing dependencies

**Solutions:**
1. Update npm:
   ```bash
   npm install -g npm@latest
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Use different registry:
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

#### Problem: "Node version incompatible"
**Symptoms:**
- Error about Node version

**Solutions:**
1. Check Node version:
   ```bash
   node --version
   ```

2. Install Node.js v14 or higher from nodejs.org

---

### 9. Performance Issues

#### Problem: "Slow page loading"
**Symptoms:**
- Pages take long to load
- API requests timeout

**Solutions:**
1. Check if backend is running
2. Verify MongoDB is not overloaded
3. Check network connection
4. Reduce number of documents (pagination needed)

#### Problem: "Browser freezes"
**Symptoms:**
- Browser becomes unresponsive
- High CPU usage

**Solutions:**
1. Clear browser cache
2. Close other tabs
3. Restart browser
4. Check for infinite loops in JavaScript

---

### 10. Development Environment Issues

#### Problem: "VS Code not recognizing files"
**Symptoms:**
- IntelliSense not working
- Import errors

**Solutions:**
1. Reload VS Code window (Ctrl+Shift+P → Reload Window)
2. Install recommended extensions
3. Check workspace settings

#### Problem: "Live Server not working"
**Symptoms:**
- Cannot open frontend with Live Server

**Solutions:**
1. Install Live Server extension in VS Code
2. Right-click on login.html → Open with Live Server
3. Or manually open file in browser

---

## Debugging Tips

### Backend Debugging

1. **Add console.logs:**
   ```javascript
   console.log('Request body:', req.body);
   console.log('User:', req.user);
   ```

2. **Check backend logs:**
   - Look at terminal where backend is running
   - Check for error messages

3. **Use Postman/Thunder Client:**
   - Test API endpoints directly
   - Verify request/response format

### Frontend Debugging

1. **Browser DevTools (F12):**
   - Console: Check for JavaScript errors
   - Network: Check API requests/responses
   - Application: Check localStorage

2. **Add console.logs:**
   ```javascript
   console.log('Token:', token);
   console.log('Response:', data);
   ```

3. **Check network requests:**
   - Verify correct URL
   - Check request headers
   - Verify response status

### Database Debugging

1. **MongoDB Shell:**
   ```javascript
   mongo
   use it_documentation_portal
   db.users.find().pretty()
   db.documents.find().pretty()
   ```

2. **Check collections:**
   ```javascript
   show collections
   db.users.countDocuments()
   db.documents.countDocuments()
   ```

---

## Error Messages Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| ECONNREFUSED | MongoDB not running | Start MongoDB service |
| EADDRINUSE | Port already in use | Change port or kill process |
| E11000 | Duplicate key | Use unique email |
| ValidationError | Missing required field | Fill all required fields |
| JsonWebTokenError | Invalid token | Login again |
| TokenExpiredError | Token expired | Login again |
| MulterError | File upload issue | Check file type/size |
| CastError | Invalid ObjectId | Check ID format |

---

## Quick Fixes

### Reset Everything
```bash
# Stop backend (Ctrl+C)
# Stop MongoDB
net stop MongoDB

# Clear database
mongo
use it_documentation_portal
db.dropDatabase()
exit

# Restart MongoDB
net start MongoDB

# Reinstall dependencies
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Recreate admin user (see MONGODB_SETUP.md)

# Start backend
npm start
```

### Clear Frontend State
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Verify Setup
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB
mongo --version

# Check if MongoDB is running
mongo
show dbs
exit

# Check backend dependencies
cd backend
npm list

# Check if port 5000 is free
netstat -an | findstr 5000
```

---

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - Backend terminal output
   - Browser console (F12)
   - MongoDB logs

2. **Verify the basics:**
   - MongoDB is running
   - Backend is running
   - Correct URLs and ports
   - All dependencies installed

3. **Review documentation:**
   - README.md
   - QUICKSTART.md
   - ARCHITECTURE.md

4. **Test with default setup:**
   - Use default credentials
   - Test with sample files
   - Follow exact steps in QUICKSTART.md

5. **Ask for help:**
   - Provide error messages
   - Share relevant code
   - Describe steps to reproduce
   - Include screenshots if helpful

---

## Prevention Tips

1. **Always check before starting:**
   - MongoDB is running
   - Backend is running
   - Correct port numbers

2. **Keep backups:**
   - Export MongoDB data regularly
   - Keep uploaded files backed up

3. **Use version control:**
   - Commit working code
   - Don't modify core files unnecessarily

4. **Test incrementally:**
   - Test each feature after implementation
   - Don't make multiple changes at once

5. **Read error messages:**
   - Error messages usually tell you what's wrong
   - Google the error message if unclear

---

## Contact & Support

For persistent issues:
- Review all documentation files
- Check MongoDB and Node.js official documentation
- Search for similar issues online
- Ask your instructor or peers

Remember: Most issues are due to:
1. MongoDB not running (40%)
2. Wrong port numbers (20%)
3. Missing dependencies (15%)
4. Authentication issues (15%)
5. Other (10%)
