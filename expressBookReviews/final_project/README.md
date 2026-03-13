# 📚 Online Book Review Application

A RESTful back-end application built with **Node.js** and **Express.js** that allows users to browse books and manage reviews with JWT-based authentication.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
node index.js
# or for development with auto-restart:
npx nodemon index.js
```
Server runs at: `http://localhost:5000`

---

## 📁 Project Structure

```
book-review-app/
├── index.js              # Main Express server + session/JWT middleware
├── package.json
└── router/
    ├── booksdb.js        # Pre-loaded books database (10 books)
    ├── general.js        # Public routes (Tasks 1–5, 10)
    └── auth_users.js     # Authenticated routes (Tasks 7–9)
```

---

## 🔑 Authentication Flow

1. **Register** a user → `/register`
2. **Login** → `/customer/login` (receives JWT stored in session)
3. **Use protected routes** → `/customer/auth/*` (JWT verified automatically)

---

## 🧪 Testing with cURL

### Task 10 — Register a New User
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "pass123"}'
```

### Task 7 — Login
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username": "john", "password": "pass123"}'
```
> `-c cookies.txt` saves the session cookie for subsequent requests.

---

### Task 1 — Get All Books
```bash
curl http://localhost:5000/
```

### Task 2 — Get Book by ISBN
```bash
curl http://localhost:5000/isbn/1
```

### Task 3 — Get Books by Author
```bash
curl "http://localhost:5000/author/Jane%20Austen"
```

### Task 4 — Get Books by Title
```bash
curl "http://localhost:5000/title/Things%20Fall%20Apart"
```

### Task 5 — Get Reviews for a Book
```bash
curl http://localhost:5000/review/1
```

---

### Task 8 — Add / Update a Review (must be logged in)
```bash
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Amazing+book!" \
  -b cookies.txt
```

### Task 9 — Delete a Review (must be logged in)
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 \
  -b cookies.txt
```

---

## ✅ Feature Checklist

| Task | Feature | Type |
|------|---------|------|
| 1 | Get all books | Async/Await + Promise |
| 2 | Get book by ISBN | Async/Await + Promise |
| 3 | Get books by author | Async/Await + Promise |
| 4 | Get books by title | Async/Await + Promise |
| 5 | Get book reviews | Sync |
| 6 | Register new user | Sync |
| 7 | Login with JWT | JWT + Session |
| 8 | Add/Update review | Auth protected |
| 9 | Delete review | Auth protected (own reviews only) |
| 10 | Multiple users | Non-blocking async design |

---

## 🔒 Security Features

- **JWT tokens** (1 hour expiry) signed with a secret key
- **Express-session** stores the JWT after login
- **Route-level middleware** protects all `/customer/auth/*` endpoints
- Users can only modify/delete **their own** reviews
