const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const { authenticated, JWT_SECRET } = require("./router/auth_users.js");
const { general } = require("./router/general.js");

const app = express();
const PORT = 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// ─── JWT Authentication Middleware (for /customer/auth/* routes) ──────────────
app.use("/customer/auth", (req, res, next) => {
  const authorization = req.session.authorization;

  if (!authorization || !authorization.token) {
    return res.status(401).json({ message: "User is not logged in. Please log in to continue." });
  }

  try {
    const decoded = jwt.verify(authorization.token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Public routes (no authentication required)
app.use("/", general);

// Auth routes (login lives here — no JWT needed for login itself)
app.use("/customer", authenticated);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`📚 Book Review Server is running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  PUBLIC:`);
  console.log(`    POST   /register              - Register a new user`);
  console.log(`    GET    /                      - Get all books`);
  console.log(`    GET    /isbn/:isbn             - Get book by ISBN`);
  console.log(`    GET    /author/:author         - Get books by author`);
  console.log(`    GET    /title/:title           - Get books by title`);
  console.log(`    GET    /review/:isbn           - Get reviews for a book`);
  console.log(`\n  AUTHENTICATED (login required):`);
  console.log(`    POST   /customer/login         - Login`);
  console.log(`    PUT    /customer/auth/review/:isbn?review=...  - Add/update review`);
  console.log(`    DELETE /customer/auth/review/:isbn             - Delete review`);
});
