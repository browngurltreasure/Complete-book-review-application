const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

// In-memory user store
let users = [];

// JWT secret key
const JWT_SECRET = "your_jwt_secret_key_bookshop_2024";

// ─── Helper: Check if username already exists ─────────────────────────────────
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// ─── Helper: Authenticate username + password ─────────────────────────────────
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// ─── Task 7: Login ────────────────────────────────────────────────────────────
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials. Please check your username and password." });
  }

  // Sign a JWT token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  // Save token in session
  req.session.authorization = { token, username };

  return res.status(200).json({
    message: `User '${username}' logged in successfully!`,
    token,
  });
});

// ─── Task 8: Add or Update a book review (logged-in users only) ───────────────
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.user.username; // Set by JWT middleware in index.js

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter (?review=...)" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }

  // If the user already has a review, it gets updated; otherwise a new one is added
  const isUpdate = !!book.reviews[username];
  book.reviews[username] = review;

  return res.status(200).json({
    message: isUpdate
      ? `Review updated successfully for ISBN ${isbn}`
      : `Review added successfully for ISBN ${isbn}`,
    reviews: book.reviews,
  });
});

// ─── Task 9: Delete a book review (logged-in users only, own reviews only) ────
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: `No review found for user '${username}' on ISBN ${isbn}` });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: `Review by '${username}' deleted successfully for ISBN ${isbn}`,
    reviews: book.reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
