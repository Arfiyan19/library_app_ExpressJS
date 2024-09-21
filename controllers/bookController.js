const Book = require('../models/book');

// Get all books
exports.getBooks = (req, res) => {
    Book.getAll((err, books) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books available' });
        }
        res.status(200).json(books);
    });
};

// Get book by ID
exports.getBookById = (req, res) => {
    const bookId = req.params.id;

    if (!bookId || isNaN(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    Book.getBookById(bookId, (err, book) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    });
};

// Create a new book
exports.createBook = (req, res) => {
    const { code, title, author, stock } = req.body;

    if (!code || !title || !author || stock === undefined) {
        return res.status(400).json({ error: 'Code, title, author, and stock are required' });
    }

    const newBook = { code, title, author, stock: parseInt(stock) };

    Book.create(newBook, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Book created successfully', bookId: result.insertId });
    });
};

// Update a book
exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const { code, title, author, stock } = req.body;

    if (!bookId || isNaN(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    if (!code || !title || !author || stock === undefined) {
        return res.status(400).json({ error: 'Code, title, author, and stock are required' });
    }

    const updatedBook = { code, title, author, stock: parseInt(stock) };

    Book.update(bookId, updatedBook, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Book updated successfully' });
    });
};

// Delete a book
exports.deleteBook = (req, res) => {
    const bookId = req.params.id;

    if (!bookId || isNaN(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    Book.delete(bookId, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    });
};
