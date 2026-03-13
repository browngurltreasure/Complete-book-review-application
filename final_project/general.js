const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ─── Task 10: Register New User ───────────────────────────────────────────────
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose another." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User '${username}' registered successfully!` });
});

// ─── Task 1: Get all books (using async/await with Promise) ───────────────────
public_users.get("/", async (req, res) => {
  try {
    // Simulate async retrieval using a Promise
    const getAllBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books.", error: err.message });
  }
});

// ─── Task 2: Get book by ISBN (using async/await with Promise) ────────────────
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error(`No book found with ISBN: ${isbn}`));
        }
      });
    };

    const book = await getBookByISBN(req.params.isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// ─── Task 3: Get books by Author (using async/await with Promise) ─────────────
public_users.get("/author/:author", async (req, res) => {
  try {
    const getBooksByAuthor = (authorName) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = {};
        const keys = Object.keys(books);

        keys.forEach((key) => {
          if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            matchingBooks[key] = books[key];
          }
        });

        if (Object.keys(matchingBooks).length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error(`No books found by author: ${authorName}`));
        }
      });
    };

    const result = await getBooksByAuthor(req.params.author);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// ─── Task 4: Get books by Title (using async/await with Promise) ──────────────
public_users.get("/title/:title", async (req, res) => {
  try {
    const getBooksByTitle = (titleName) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = {};
        const keys = Object.keys(books);

        keys.forEach((key) => {
          if (books[key].title.toLowerCase() === titleName.toLowerCase()) {
            matchingBooks[key] = books[key];
          }
        });

        if (Object.keys(matchingBooks).length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error(`No books found with title: ${titleName}`));
        }
      });
    };

    const result = await getBooksByTitle(req.params.title);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// ─── Task 5: Get book reviews by ISBN ────────────────────────────────────────
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }

  const reviews = book.reviews;

  if (Object.keys(reviews).length === 0) {
    return res.status(200).json({ message: "No reviews yet for this book.", reviews: {} });
  }

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
