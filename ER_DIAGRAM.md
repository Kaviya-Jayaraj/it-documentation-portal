# ER Diagram - IT Documentation Portal

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ER DIAGRAM                              │
└─────────────────────────────────────────────────────────────────┘


┌──────────────────────────┐                ┌──────────────────────────┐
│         USER             │                │       DOCUMENT           │
├──────────────────────────┤                ├──────────────────────────┤
│ PK  _id: ObjectId        │                │ PK  _id: ObjectId        │
│     name: String         │                │     title: String        │
│     email: String (UK)   │                │     description: String  │
│     password: String     │                │     category: String     │
│     role: String         │                │     filePath: String     │
│     createdAt: Date      │                │ FK  uploadedBy: ObjectId │
│     updatedAt: Date      │                │     createdAt: Date      │
└──────────────────────────┘                │     updatedAt: Date      │
            │                               └──────────────────────────┘
            │                                           │
            │                                           │
            │         1                        N        │
            └───────────────── uploads ────────────────┘
                              (1:N)


Legend:
-------
PK  = Primary Key
FK  = Foreign Key
UK  = Unique Key
1   = One
N   = Many
```

---

## Detailed Entity Descriptions

### 1. USER Entity

| Attribute   | Data Type | Constraints           | Description                    |
|-------------|-----------|----------------------|--------------------------------|
| _id         | ObjectId  | Primary Key          | Unique identifier              |
| name        | String    | Required             | User's full name               |
| email       | String    | Required, Unique     | User's email (login)           |
| password    | String    | Required             | Hashed password (bcrypt)       |
| role        | String    | Required, Enum       | 'admin' or 'user'              |
| createdAt   | Date      | Auto-generated       | Account creation timestamp     |
| updatedAt   | Date      | Auto-generated       | Last update timestamp          |

**Constraints:**
- email must be unique
- role must be either 'admin' or 'user'
- password is hashed using bcrypt (10 rounds)

---

### 2. DOCUMENT Entity

| Attribute    | Data Type | Constraints           | Description                    |
|--------------|-----------|----------------------|--------------------------------|
| _id          | ObjectId  | Primary Key          | Unique identifier              |
| title        | String    | Required             | Document title                 |
| description  | String    | Required             | Document description           |
| category     | String    | Required             | Document category              |
| filePath     | String    | Required             | File storage path              |
| uploadedBy   | ObjectId  | Foreign Key          | Reference to USER._id          |
| createdAt    | Date      | Auto-generated       | Upload timestamp               |
| updatedAt    | Date      | Auto-generated       | Last update timestamp          |

**Constraints:**
- uploadedBy references USER._id
- filePath must point to valid file
- Allowed file types: PDF, DOCX, TXT
- Max file size: 10MB

---

## Relationships

### USER → DOCUMENT (1:N)

**Relationship Type:** One-to-Many

**Description:**
- One USER can upload MANY DOCUMENTS
- Each DOCUMENT is uploaded by ONE USER

**Implementation:**
- DOCUMENT.uploadedBy (Foreign Key) → USER._id (Primary Key)
- Mongoose populate: `uploadedBy` field references `User` model

**Cardinality:**
```
USER (1) ────── uploads ────── (N) DOCUMENT
```

**Business Rules:**
1. A user must exist before uploading documents
2. When a user is deleted, their documents can be:
   - Deleted (CASCADE)
   - Kept with null reference (SET NULL)
   - Transferred to another user
3. Admin users can manage all documents
4. Regular users can only view documents

---

## Cardinality Details

```
┌──────────┐                              ┌──────────────┐
│   USER   │                              │   DOCUMENT   │
│          │                              │              │
│  1 user  │ ─────── can upload ────────> │ 0..* docs    │
│          │                              │              │
│          │ <────── uploaded by ──────── │ 1 user       │
└──────────┘                              └──────────────┘

Minimum: 1 user can have 0 documents
Maximum: 1 user can have unlimited documents
```

---

## Database Schema (MongoDB)

### users Collection
```javascript
{
  _id: ObjectId("..."),
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...",  // bcrypt hash
  role: "admin",            // or "user"
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

### documents Collection
```javascript
{
  _id: ObjectId("..."),
  title: "Sample Document",
  description: "This is a sample document",
  category: "Technical",
  filePath: "uploads/1234567890-document.pdf",
  uploadedBy: ObjectId("..."),  // References users._id
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

---

## Indexes

### users Collection
```javascript
{
  email: 1  // Unique index for fast login lookup
}
```

### documents Collection
```javascript
{
  uploadedBy: 1,     // Index for user's documents
  category: 1,       // Index for category search
  title: "text"      // Text index for search
}
```

---

## Visual ER Diagram (Crow's Foot Notation)

```
        ┌─────────────┐
        │    USER     │
        ├─────────────┤
        │ * _id       │
        │   name      │
        │   email     │
        │   password  │
        │   role      │
        │   createdAt │
        │   updatedAt │
        └──────┬──────┘
               │
               │ uploads
               │ (1:N)
               │
               ○<
               │
               │
        ┌──────┴──────┐
        │  DOCUMENT   │
        ├─────────────┤
        │ * _id       │
        │   title     │
        │   description│
        │   category  │
        │   filePath  │
        │ # uploadedBy│
        │   createdAt │
        │   updatedAt │
        └─────────────┘

Legend:
* = Primary Key
# = Foreign Key
○< = Many (Crow's foot)
│ = One
```

---

## Normalization

**Current Form:** 3NF (Third Normal Form)

### 1NF (First Normal Form):
✅ All attributes contain atomic values
✅ No repeating groups

### 2NF (Second Normal Form):
✅ In 1NF
✅ No partial dependencies (all non-key attributes depend on entire primary key)

### 3NF (Third Normal Form):
✅ In 2NF
✅ No transitive dependencies

---

## Data Integrity Rules

### Referential Integrity:
- `DOCUMENT.uploadedBy` must reference valid `USER._id`
- Enforced by Mongoose schema validation

### Entity Integrity:
- Each entity must have unique primary key (_id)
- Automatically handled by MongoDB

### Domain Integrity:
- `USER.role` must be 'admin' or 'user'
- `USER.email` must be valid email format
- `DOCUMENT.filePath` must be valid path
- Enforced by Mongoose schema validation

---

## Sample Data Flow

```
1. User Registration/Creation:
   ┌──────────┐
   │   USER   │ ← Create new user
   └──────────┘

2. Document Upload:
   ┌──────────┐     uploads     ┌──────────────┐
   │   USER   │ ───────────────> │   DOCUMENT   │
   └──────────┘                  └──────────────┘
        │                               │
        └─── uploadedBy (FK) ───────────┘

3. Query Documents by User:
   ┌──────────┐                  ┌──────────────┐
   │   USER   │ <─── populate ── │   DOCUMENT   │
   └──────────┘                  └──────────────┘
```

---

## Query Examples

### Get all documents with user info:
```javascript
Document.find().populate('uploadedBy', 'name email')
```

### Get all documents by specific user:
```javascript
Document.find({ uploadedBy: userId })
```

### Get user with their documents:
```javascript
User.findById(userId)
// Then: Document.find({ uploadedBy: userId })
```

---

## Summary

**Total Entities:** 2 (USER, DOCUMENT)
**Total Relationships:** 1 (USER uploads DOCUMENT)
**Relationship Type:** One-to-Many (1:N)
**Foreign Keys:** 1 (DOCUMENT.uploadedBy → USER._id)
**Unique Constraints:** 1 (USER.email)
