# System Architecture

## Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                     (HTML, CSS, JavaScript)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  login.html  │  │  admin.html  │  │  user.html   │        │
│  │  login.js    │  │  admin.js    │  │  user.js     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│                    ↓ HTTP Requests (Fetch API) ↓               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ JWT Token in Headers
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                           │
│                    (Node.js + Express.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    server.js (Entry Point)                │ │
│  │                    - CORS Configuration                   │ │
│  │                    - Middleware Setup                     │ │
│  │                    - Route Registration                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                 │                               │
│                    ┌────────────┼────────────┐                 │
│                    ↓            ↓            ↓                  │
│         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│         │ authRoutes   │ │ docRoutes    │ │ userRoutes   │   │
│         └──────────────┘ └──────────────┘ └──────────────┘   │
│                    │            │            │                  │
│         ┌──────────┴────────────┴────────────┴──────────┐     │
│         │          MIDDLEWARE LAYER                      │     │
│         │  ┌──────────────┐  ┌──────────────┐          │     │
│         │  │   auth.js    │  │  upload.js   │          │     │
│         │  │  - protect   │  │  - multer    │          │     │
│         │  │  - admin     │  │  - storage   │          │     │
│         │  └──────────────┘  └──────────────┘          │     │
│         └───────────────────────────────────────────────┘     │
│                    │            │            │                  │
│                    ↓            ↓            ↓                  │
│         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│         │authController│ │docController │ │userController│   │
│         └──────────────┘ └──────────────┘ └──────────────┘   │
│                    │            │            │                  │
│                    └────────────┼────────────┘                 │
│                                 ↓                               │
│                    ┌────────────────────────┐                  │
│                    │    MODELS LAYER        │                  │
│                    │  ┌──────────────┐     │                  │
│                    │  │   User.js    │     │                  │
│                    │  │ - Schema     │     │                  │
│                    │  │ - Validation │     │                  │
│                    │  │ - Bcrypt     │     │                  │
│                    │  └──────────────┘     │                  │
│                    │  ┌──────────────┐     │                  │
│                    │  │ Document.js  │     │                  │
│                    │  │ - Schema     │     │                  │
│                    │  │ - Validation │     │                  │
│                    │  └──────────────┘     │                  │
│                    └────────────────────────┘                  │
│                                 │                               │
└─────────────────────────────────┼───────────────────────────────┘
                                  │ Mongoose ODM
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│                          (MongoDB)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Database: it_documentation_portal                              │
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐       │
│  │  users Collection    │      │ documents Collection │       │
│  ├──────────────────────┤      ├──────────────────────┤       │
│  │ - _id                │      │ - _id                │       │
│  │ - name               │      │ - title              │       │
│  │ - email              │      │ - description        │       │
│  │ - password (hashed)  │      │ - category           │       │
│  │ - role               │      │ - filePath           │       │
│  │ - createdAt          │      │ - uploadedBy (ref)   │       │
│  │ - updatedAt          │      │ - createdAt          │       │
│  └──────────────────────┘      │ - updatedAt          │       │
│                                 └──────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                                    ┌──────────┐
│  Client  │                                                    │  Server  │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │  1. POST /api/auth/login                                     │
     │     { email, password }                                      │
     ├──────────────────────────────────────────────────────────────>
     │                                                               │
     │                          2. Validate credentials             │
     │                             (Bcrypt compare)                 │
     │                                                               │
     │                          3. Generate JWT token               │
     │                             (7 days expiry)                  │
     │                                                               │
     │  4. Return token + user data                                 │
     <──────────────────────────────────────────────────────────────┤
     │                                                               │
     │  5. Store token in localStorage                              │
     │                                                               │
     │  6. Subsequent requests with token                           │
     │     Headers: { Authorization: "Bearer <token>" }             │
     ├──────────────────────────────────────────────────────────────>
     │                                                               │
     │                          7. Verify JWT token                 │
     │                             (Middleware)                     │
     │                                                               │
     │                          8. Attach user to request           │
     │                                                               │
     │  9. Return protected resource                                │
     <──────────────────────────────────────────────────────────────┤
     │                                                               │
```

## File Upload Flow

```
┌──────────┐                                                    ┌──────────┐
│  Admin   │                                                    │  Server  │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │  1. Select file + fill form                                  │
     │                                                               │
     │  2. POST /api/documents                                      │
     │     Content-Type: multipart/form-data                        │
     │     { title, description, category, file }                   │
     ├──────────────────────────────────────────────────────────────>
     │                                                               │
     │                          3. Auth Middleware                  │
     │                             - Verify JWT                     │
     │                             - Check admin role               │
     │                                                               │
     │                          4. Multer Middleware                │
     │                             - Validate file type             │
     │                             - Check file size                │
     │                             - Save to uploads/               │
     │                                                               │
     │                          5. Document Controller              │
     │                             - Create document record         │
     │                             - Save to MongoDB                │
     │                                                               │
     │  6. Return success response                                  │
     <──────────────────────────────────────────────────────────────┤
     │                                                               │
     │  7. Refresh document list                                    │
     │                                                               │
```

## Role-Based Access Control

```
                        ┌─────────────────┐
                        │   User Login    │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐           ┌──────▼──────┐
              │   Admin   │           │    User     │
              └─────┬─────┘           └──────┬──────┘
                    │                        │
        ┌───────────┼───────────┐           │
        │           │           │           │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐ ┌────▼────┐
   │ Upload  │ │ Edit   │ │ Delete │ │  View   │
   │ Docs    │ │ Docs   │ │ Docs   │ │  Docs   │
   └─────────┘ └────────┘ └────────┘ └────┬────┘
        │           │           │           │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐ ┌────▼────┐
   │ Create  │ │ View   │ │ Manage │ │ Search  │
   │ Users   │ │ Users  │ │ Users  │ │  Docs   │
   └─────────┘ └────────┘ └────────┘ └────┬────┘
                                            │
                                       ┌────▼────┐
                                       │Download │
                                       │  Docs   │
                                       └─────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                             │
└───────┬─────────────────────────────────────────────────────────┘
        │
        ├─── Login ──────────────────────────────────────────────┐
        │                                                         │
        ├─── Upload Document (Admin) ────────────────────────────┤
        │                                                         │
        ├─── Edit Document (Admin) ──────────────────────────────┤
        │                                                         │
        ├─── Delete Document (Admin) ────────────────────────────┤
        │                                                         │
        ├─── View Documents ─────────────────────────────────────┤
        │                                                         │
        ├─── Search Documents ───────────────────────────────────┤
        │                                                         │
        ├─── Download Document ──────────────────────────────────┤
        │                                                         │
        ├─── Create User (Admin) ────────────────────────────────┤
        │                                                         │
        └─── Delete User (Admin) ────────────────────────────────┤
                                                                  │
                                                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (JavaScript)                        │
│  - Capture user input                                           │
│  - Validate form data                                           │
│  - Send HTTP requests                                           │
│  - Handle responses                                             │
│  - Update UI                                                    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API ROUTES (Express)                         │
│  - /api/auth/*                                                  │
│  - /api/documents/*                                             │
│  - /api/users/*                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE                                   │
│  - Authentication (JWT verify)                                  │
│  - Authorization (Role check)                                   │
│  - File Upload (Multer)                                         │
│  - Error Handling                                               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLERS                                  │
│  - Business logic                                               │
│  - Data validation                                              │
│  - Call model methods                                           │
│  - Return responses                                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MODELS (Mongoose)                            │
│  - Define schemas                                               │
│  - Data validation                                              │
│  - Database operations                                          │
│  - Password hashing                                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                           │
│  - Store users                                                  │
│  - Store documents                                              │
│  - Handle queries                                               │
│  - Return results                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Frontend Validation                                   │
│  ├─ Required field validation                                   │
│  ├─ Email format validation                                     │
│  └─ File type validation                                        │
│                                                                 │
│  Layer 2: Authentication (JWT)                                  │
│  ├─ Token generation on login                                   │
│  ├─ Token verification on each request                          │
│  └─ Token expiry (7 days)                                       │
│                                                                 │
│  Layer 3: Authorization (Role-based)                            │
│  ├─ Admin-only routes                                           │
│  ├─ User-accessible routes                                      │
│  └─ Protected routes                                            │
│                                                                 │
│  Layer 4: Password Security                                     │
│  ├─ Bcrypt hashing (10 rounds)                                  │
│  ├─ Password never stored in plain text                         │
│  └─ Password never sent in responses                            │
│                                                                 │
│  Layer 5: File Upload Security                                  │
│  ├─ File type whitelist (PDF, DOCX, TXT)                        │
│  ├─ File size limit (10MB)                                      │
│  └─ Unique filename generation                                  │
│                                                                 │
│  Layer 6: Database Security                                     │
│  ├─ Schema validation                                           │
│  ├─ Unique constraints                                          │
│  └─ Mongoose sanitization                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     HTML5    │  │     CSS3     │  │  JavaScript  │         │
│  │  (Structure) │  │   (Styling)  │  │   (Logic)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Node.js    │  │  Express.js  │  │     JWT      │         │
│  │  (Runtime)   │  │  (Framework) │  │    (Auth)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Bcrypt    │  │    Multer    │  │     CORS     │         │
│  │  (Hashing)   │  │   (Upload)   │  │  (Security)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                     │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   MongoDB    │  │   Mongoose   │                            │
│  │  (Database)  │  │     (ODM)    │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

## Folder Structure Visualization

```
it-documentation-portal/
│
├── backend/                    ← Backend Application
│   ├── config/                ← Configuration Files
│   │   └── db.js             ← MongoDB Connection
│   │
│   ├── controllers/           ← Business Logic
│   │   ├── authController.js ← Login & Profile
│   │   ├── documentController.js ← Document CRUD
│   │   └── userController.js ← User Management
│   │
│   ├── middleware/            ← Request Processing
│   │   ├── auth.js           ← JWT Verification
│   │   └── upload.js         ← File Upload Config
│   │
│   ├── models/                ← Database Schemas
│   │   ├── User.js           ← User Model
│   │   └── Document.js       ← Document Model
│   │
│   ├── routes/                ← API Endpoints
│   │   ├── authRoutes.js     ← Auth Routes
│   │   ├── documentRoutes.js ← Document Routes
│   │   └── userRoutes.js     ← User Routes
│   │
│   ├── uploads/               ← Uploaded Files Storage
│   ├── .env                   ← Environment Variables
│   ├── server.js              ← Express Server
│   └── package.json           ← Dependencies
│
└── frontend/                   ← Frontend Application
    ├── css/                   ← Stylesheets
    │   └── style.css         ← Main Styles
    │
    ├── js/                    ← JavaScript Files
    │   ├── login.js          ← Login Logic
    │   ├── admin.js          ← Admin Dashboard
    │   └── user.js           ← User Dashboard
    │
    ├── login.html             ← Login Page
    ├── admin.html             ← Admin Dashboard
    └── user.html              ← User Dashboard
```
