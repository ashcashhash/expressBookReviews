const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return !users.some((user) => user.username === username)
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    const secretKey = "mySuperSecretKey";

    const user = users.find((user) => user.username === username);

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Incorrect credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ message: "User logged in successfully!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user?.username; // Extract username from JWT (assuming authentication middleware)

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Find the book based on ISBN
    const book_key = Object.keys(books).find(key => books[key].isbn === isbn);

    if (!book_key) {
        return res.status(404).json({ message: "Book not found with the given ISBN." });
    }

    // Save or update the review
    books[book_key].reviews[username] = review;
    return res.status(200).json({ message: "Review has been added/updated successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user?.username; // Extract username from JWT

    // Find the book based on ISBN
    const book_key = Object.keys(books).find(key => books[key].isbn === isbn);

    if (!book_key) {
        return res.status(404).json({ message: "Book not found with the given ISBN." });
    }

    // Check if the user has a review for this book
    if (!books[book_key].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user." });
    }

    // Delete the review
    delete books[book_key].reviews[username];

    return res.status(200).json({ message: "Review has been deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
