# Testing Guide

## Manual Testing Checklist

### 1. Authentication Testing

#### Login Tests
- [ ] Login with valid admin credentials
- [ ] Login with valid user credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Login with empty fields (should show error)
- [ ] Verify admin redirects to admin.html
- [ ] Verify user redirects to user.html

#### Authorization Tests
- [ ] Try accessing admin.html as user (should redirect to login)
- [ ] Try accessing user.html as admin (should redirect to login)
- [ ] Try accessing dashboards without token (should redirect to login)

### 2. Admin Module Testing

#### Document Upload
- [ ] Upload PDF file successfully
- [ ] Upload DOCX file successfully
- [ ] Upload TXT file successfully
- [ ] Try uploading invalid file type (should show error)
- [ ] Try uploading file larger than 10MB (should show error)
- [ ] Verify all fields are required
- [ ] Verify document appears in list after upload

#### Document Management
- [ ] Edit document title
- [ ] Edit document description
- [ ] Edit document category
- [ ] Delete document (with confirmation)
- [ ] Verify deleted document is removed from list
- [ ] Download document

#### User Management
- [ ] Create new user with 'user' role
- [ ] Create new admin with 'admin' role
- [ ] Try creating user with existing email (should show error)
- [ ] Delete user (not yourself)
- [ ] Verify deleted user cannot login
- [ ] Verify you cannot delete yourself

#### Search Functionality
- [ ] Search by document title
- [ ] Search by category
- [ ] Search with partial match
- [ ] Search with no results
- [ ] Clear search shows all documents

### 3. User Module Testing

#### Document Viewing
- [ ] View all documents
- [ ] View document details in modal
- [ ] Download document
- [ ] Verify cannot edit documents
- [ ] Verify cannot delete documents
- [ ] Verify cannot see user management

#### Search Functionality
- [ ] Search by document title
- [ ] Search by category
- [ ] Search with partial match
- [ ] Clear search shows all documents

### 4. Security Testing

- [ ] Verify passwords are not visible in network requests
- [ ] Verify JWT token is stored in localStorage
- [ ] Verify API calls include Authorization header
- [ ] Verify unauthorized requests return 401
- [ ] Verify admin-only routes return 403 for users
- [ ] Logout clears token and redirects to login

### 5. UI/UX Testing

- [ ] All buttons are clickable and responsive
- [ ] Forms validate required fields
- [ ] Error messages are displayed clearly
- [ ] Success messages appear after actions
- [ ] Modals open and close properly
- [ ] Tables display data correctly
- [ ] Search bar is responsive
- [ ] Layout is clean and organized

### 6. Error Handling

- [ ] Backend not running (connection error)
- [ ] MongoDB not running (database error)
- [ ] Invalid token (authentication error)
- [ ] File not found (download error)
- [ ] Network timeout
- [ ] Invalid form data

## Test Data

### Test Users

**Admin:**
- Name: Admin User
- Email: admin@example.com
- Password: admin123
- Role: admin

**Regular User:**
- Name: Test User
- Email: user@example.com
- Password: admin123
- Role: user

### Test Documents

Create test documents with various:
- **Categories:** Technical, User Guide, Policy, Tutorial, Reference
- **File Types:** PDF, DOCX, TXT
- **Titles:** Various lengths and special characters

## API Testing with Postman/Thunder Client

### 1. Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Get All Documents
```
GET http://localhost:5000/api/documents
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

### 3. Upload Document
```
POST http://localhost:5000/api/documents
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
Body (form-data): {
  "title": "Test Document",
  "description": "Test Description",
  "category": "Test",
  "file": [select file]
}
```

### 4. Search Documents
```
GET http://localhost:5000/api/documents/search?query=test
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

### 5. Create User (Admin Only)
```
POST http://localhost:5000/api/users
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
Body: {
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

## Expected Results

### Successful Operations
- Status Code: 200 (GET), 201 (POST)
- Response includes success message
- Data is updated in database
- UI reflects changes immediately

### Failed Operations
- Status Code: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
- Response includes error message
- UI displays error to user
- No data corruption

## Performance Testing

- [ ] Page loads within 2 seconds
- [ ] Document upload completes within 5 seconds
- [ ] Search results appear instantly
- [ ] No memory leaks after extended use
- [ ] Multiple concurrent users can access system

## Browser Compatibility

Test on:
- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Microsoft Edge
- [ ] Safari (if available)

## Common Issues and Solutions

### Issue: Cannot login
- Check if backend is running
- Check if MongoDB is running
- Verify user exists in database
- Check browser console for errors

### Issue: File upload fails
- Check file type (PDF, DOCX, TXT only)
- Check file size (max 10MB)
- Verify uploads folder exists
- Check backend logs

### Issue: Documents not displaying
- Check API response in network tab
- Verify token is valid
- Check backend logs
- Verify documents exist in database

### Issue: Search not working
- Check if query parameter is sent
- Verify API endpoint is correct
- Check backend search logic
- Test with different search terms

## Reporting Bugs

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots (if applicable)
5. Browser and version
6. Console errors
7. Network request/response

## Test Report Template

```
Test Date: [Date]
Tester: [Name]
Environment: [Development/Production]

Passed Tests: X/Y
Failed Tests: Y/Y

Critical Issues: [List]
Minor Issues: [List]

Notes: [Additional observations]
```
