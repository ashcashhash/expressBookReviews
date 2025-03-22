const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (await isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User registered successfully!" });
        } else {
            return res.status(302).json({ message: "User already exists" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    try {
        const booksList = await new Promise((resolve) => resolve(books));
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const { isbn } = req.params;
        const book = await new Promise((resolve) => 
            resolve(Object.values(books).find(book => book.isbn === isbn))
        );

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found with the given ISBN." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    try {
        const { author } = req.params;
        const booksByAuthor = await new Promise((resolve) => 
            resolve(Object.values(books).filter(book => book.author === author))
        );

        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found by the given author." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const booksByTitle = await new Promise((resolve) => 
            resolve(Object.values(books).filter(book => book.title === title))
        );

        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No books found with the given title." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get book review
public_users.get("/review/:isbn", async (req, res) => {
    try {
        const { isbn } = req.params;
        const book = await new Promise((resolve) => 
            resolve(Object.values(books).find(book => book.isbn === isbn))
        );

        if (book) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "Book not found with the given ISBN." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports.general = public_users;
