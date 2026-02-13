# IT Documentation Portal

A full-stack web application for managing IT documentation with role-based access control.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT with bcrypt password hashing

## Features

### Admin Features
- Secure login with JWT authentication
- Upload documents (PDF, DOCX, TXT)
- Edit document details
- Delete documents
- Create and manage users
- View all documents and users
- Search documents by title or category

### User Features
- Secure login with JWT authentication
- View all documents
- Search documents
- View document details
- Download documents
- Read-only access

## Project Structure

```
it-documentation-portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── documentController.js # Document CRUD operations
│   │   └── userController.js     # User management
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── upload.js             # Multer file upload configuration
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Document.js           # Document schema
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── documentRoutes.js     # Document routes
│   │   └── userRoutes.js         # User routes
│   ├── uploads/                  # Uploaded files directory
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   └── package.json              # Backend dependencies
└── frontend/
    ├── css/
    │   └── style.css             # Application styles
    ├── js/
    │   ├── login.js              # Login functionality
    │   ├── admin.js              # Admin dashboard logic
    │   └── user.js               # User dashboard logic
    ├── login.html                # Login page
    ├── admin.html                # Admin dashboard
    └── user.html                 # User dashboard
```

## Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
3. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## Installation & Setup

### Step 1: Install MongoDB

1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows:** MongoDB should start automatically after installation
   - **Mac/Linux:** Run `mongod` in terminal

3. Verify MongoDB is running:
   ```bash
   mongo --version
   ```

### Step 2: Setup Backend

1. Open terminal/command prompt and navigate to the backend folder:
   ```bash
   cd C:\it-documentation-portal\backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify the `.env` file exists with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/it_documentation_portal
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. You should see:
   ```
   MongoDB connected successfully
   Server running on port 5000
   ```

### Step 3: Create Initial Admin User

Since this is the first time running the application, you need to create an admin user manually.

1. Open a new terminal and start MongoDB shell:
   ```bash
   mongo
   ```

2. Switch to the application database:
   ```javascript
   use it_documentation_portal
   ```

3. Create an admin user (password will be automatically hashed by the application):
   ```javascript
   db.users.insertOne({
     name: "Admin User",
     email: "admin@example.com",
     password: "$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS",
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```
   
   **Default Admin Credentials:**
   - Email: `admin@example.com`
   - Password: `admin123`

4. Create a test user:
   ```javascript
   db.users.insertOne({
     name: "Test User",
     email: "user@example.com",
     password: "$2a$10$8K1p/a0dL3LKzOWR5EHzXeKGHZQE5WxGhFFpNUzT5JhN5xKxVxqZS",
     role: "user",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```
   
   **Default User Credentials:**
   - Email: `user@example.com`
   - Password: `admin123`

5. Exit MongoDB shell:
   ```javascript
   exit
   ```

### Step 4: Setup Frontend

1. Navigate to the frontend folder:
   ```bash
   cd C:\it-documentation-portal\frontend
   ```

2. Open `login.html` in your browser:
   - Right-click on `login.html` → Open with → Your preferred browser
   - Or use Live Server extension in VS Code

   **Using Live Server in VS Code (Recommended):**
   - Install "Live Server" extension in VS Code
   - Right-click on `login.html` → "Open with Live Server"
   - This will open the application at `http://127.0.0.1:5500/login.html`

## Usage

### Login

1. Open the application in your browser
2. Use the default credentials:
   - **Admin:** admin@example.com / admin123
   - **User:** user@example.com / admin123

### Admin Dashboard

After logging in as admin, you can:

1. **Upload Documents:**
   - Click "Upload Document" button
   - Fill in title, description, category
   - Select a file (PDF, DOCX, or TXT)
   - Click "Upload"

2. **Edit Documents:**
   - Click "Edit" button on any document
   - Modify the details
   - Click "Update"

3. **Delete Documents:**
   - Click "Delete" button on any document
   - Confirm deletion

4. **Create Users:**
   - Click "Create User" button
   - Fill in user details
   - Select role (admin/user)
   - Click "Create User"

5. **Search Documents:**
   - Type in the search bar to filter documents by title or category

### User Dashboard

After logging in as user, you can:

1. **View Documents:**
   - See all available documents

2. **Search Documents:**
   - Use the search bar to find documents

3. **View Details:**
   - Click "View Details" to see full document information

4. **Download Documents:**
   - Click "Download" button to download any document

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Documents
- `POST /api/documents` - Upload document (admin only)
- `GET /api/documents` - Get all documents (protected)
- `GET /api/documents/:id` - Get single document (protected)
- `GET /api/documents/search?query=` - Search documents (protected)
- `PUT /api/documents/:id` - Update document (admin only)
- `DELETE /api/documents/:id` - Delete document (admin only)
- `GET /api/documents/:id/download` - Download document (protected)

### Users
- `POST /api/users` - Create user (admin only)
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- File type validation
- File size limits (10MB)

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- Try restarting MongoDB service

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using port 5000

### CORS Error
- Make sure backend server is running
- Check if API_URL in frontend JS files matches your backend URL

### File Upload Error
- Check if `uploads/` folder exists in backend directory
- Verify file type is PDF, DOCX, or TXT
- Check file size is under 10MB

## Development Notes

- Backend runs on `http://localhost:5000`
- Frontend should be served via Live Server or any static file server
- MongoDB stores data in `it_documentation_portal` database
- Uploaded files are stored in `backend/uploads/` directory

## Future Enhancements

- Email verification
- Password reset functionality
- Document versioning
- Document categories management
- User profile editing
- Activity logs
- Advanced search filters
- Document preview

## License

This is an academic project for educational purposes.

## Support

For issues or questions, please refer to the documentation or contact your instructor.
