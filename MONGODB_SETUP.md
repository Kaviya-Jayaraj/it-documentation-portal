# MongoDB Setup Commands

## Create Database and Users

Open MongoDB shell by running `mongo` in your terminal, then execute:

```javascript
// Switch to the application database
use it_documentation_portal

// Create Admin User
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create Test User
db.users.insertOne({
  name: "Test User",
  email: "user@example.com",
  password: "$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Verify users were created
db.users.find().pretty()
```

## Default Credentials

Both users have the same password for testing purposes:

**Admin:**
- Email: admin@example.com
- Password: admin123

**User:**
- Email: user@example.com
- Password: admin123

## Useful MongoDB Commands

```javascript
// View all users
db.users.find().pretty()

// View all documents
db.documents.find().pretty()

// Delete all documents
db.documents.deleteMany({})

// Delete all users
db.users.deleteMany({})

// Count documents
db.documents.countDocuments()

// Count users
db.users.countDocuments()

// Drop entire database (careful!)
db.dropDatabase()
```

## Notes

- The password hash `$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS` is the bcrypt hash for "admin123"
- In production, always use strong, unique passwords
- Change the JWT_SECRET in .env file for production use
