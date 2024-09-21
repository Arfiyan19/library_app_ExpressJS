const db = require('../config/db');

const Book = {
    // Mendapatkan semua buku yang tersedia
    getAll: (callback) => {
        db.query('SELECT * FROM books', callback);
    },

    // Mendapatkan buku berdasarkan ID
    getBookById: (bookId, callback) => {
        db.query('SELECT * FROM books WHERE id = ?', [bookId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },

    // Membuat buku baru
    create: (newBook, callback) => {
        const { code, title, author, stock } = newBook;
        db.query(
            'INSERT INTO books (code, title, author, stock) VALUES (?, ?, ?, ?)', 
            [code, title, author, stock], 
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        );
    },

    // Memperbarui informasi buku berdasarkan ID
    update: (bookId, updatedBook, callback) => {
        const { code, title, author, stock } = updatedBook;
        db.query(
            'UPDATE books SET code = ?, title = ?, author = ?, stock = ? WHERE id = ?',
            [code, title, author, stock, bookId],
            (err, result) => {
                if (err) return callback(err, null);
                callback(null, result);
            }
        );
    },

    // Menghapus buku berdasarkan ID
    delete: (bookId, callback) => {
        db.query('DELETE FROM books WHERE id = ?', [bookId], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },

    // Mengurangi stok buku saat buku dipinjam
    borrow: (bookId, callback) => {
        db.query('UPDATE books SET stock = stock - 1 WHERE id = ? AND stock > 0', [bookId], callback);
    },

    // Menambah stok buku saat buku dikembalikan
    returnBook: (bookId, callback) => {
        db.query('UPDATE books SET stock = stock + 1 WHERE id = ?', [bookId], callback);
    },
};

module.exports = Book;
