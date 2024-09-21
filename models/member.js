const db = require('../config/db');

const Member = {
    getAll: (callback) => {
        db.query('SELECT * FROM members', callback);
    },

    getAllWithBorrowedBooks: (callback) => {
        const query = `
            SELECT members.id, members.code, members.name, members.penalty_until, 
                   books.id AS book_id, books.title, borrowed_books.borrowed_date, borrowed_books.returned_date
            FROM members
            LEFT JOIN borrowed_books ON members.id = borrowed_books.member_id
            LEFT JOIN books ON borrowed_books.book_id = books.id;
        `;

        db.query(query, callback);
    },
    // Mengecek apakah member sedang dalam masa penalti
    checkPenalty: (memberId, callback) => {
        db.query('SELECT penalty_until FROM members WHERE id = ?', [memberId], callback);
    },

    // Set penalti jika member mengembalikan buku terlambat
    setPenalty: (memberId, penaltyDate, callback) => {
        db.query('UPDATE members SET penalty_until = ? WHERE id = ?', [penaltyDate, memberId], callback);
    },

    // Fungsi untuk mengecek apakah buku tertentu sedang dipinjam oleh anggota
    hasBorrowed: (memberId, bookId, callback) => {
        db.query(
            'SELECT borrowed_date FROM borrowed_books WHERE member_id = ? AND book_id = ? AND returned_date IS NULL',
            [memberId, bookId],
            (err, results) => {
                if (err) return callback(err, null);
                callback(null, results[0]); // Mengembalikan detail peminjaman buku, termasuk borrowed_date
            }
        );
    },
    

    // Fungsi untuk meminjam buku
    borrowBook: (memberId, bookId, borrowDate, callback) => {
        db.query(
            'INSERT INTO borrowed_books (member_id, book_id, borrowed_date) VALUES (?, ?, ?)',
            [memberId, bookId, borrowDate],
            callback
        );
    },


    // Fungsi untuk mengembalikan buku
   returnBook: (memberId, bookId, returnDate, callback) => {
    db.query(
        'UPDATE borrowed_books SET returned_date = ? WHERE member_id = ? AND book_id = ? AND returned_date IS NULL',
        [returnDate, memberId, bookId],
        callback
    );
},
returnBook: (memberId, bookId, returnDate, callback) => {
    db.query(
        'UPDATE borrowed_books SET returned_date = ? WHERE member_id = ? AND book_id = ? AND returned_date IS NULL',
        [returnDate, memberId, bookId],
        callback
    );
},

getAllBorrowingRecords: (callback) => {
        const query = `
            SELECT members.id AS member_id, members.name AS member_name, 
                   books.id AS book_id, books.title AS book_title, 
                   borrowed_books.borrowed_date
            FROM borrowed_books
            INNER JOIN members ON borrowed_books.member_id = members.id
            INNER JOIN books ON borrowed_books.book_id = books.id
            WHERE borrowed_books.returned_date IS NULL;
        `;
        db.query(query, callback);
    },

    // Mendapatkan semua catatan pengembalian buku
    getAllReturnRecords: (callback) => {
        const query = `
            SELECT members.id AS member_id, members.name AS member_name, 
                   books.id AS book_id, books.title AS book_title, 
                   borrowed_books.borrowed_date, borrowed_books.returned_date
            FROM borrowed_books
            INNER JOIN members ON borrowed_books.member_id = members.id
            INNER JOIN books ON borrowed_books.book_id = books.id
            WHERE borrowed_books.returned_date IS NOT NULL;
        `;
        db.query(query, callback);
    },
    getById: (memberId, callback) => {
        db.query('SELECT * FROM members WHERE id = ?', [memberId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },
    // Create a new member
    create: (newMember, callback) => {
        const { code, name } = newMember;
        db.query('INSERT INTO members (code, name) VALUES (?, ?)', [code, name], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },
    // Update a member
    update: (memberId, updatedMember, callback) => {
        const { code, name } = updatedMember;
        db.query('UPDATE members SET code = ?, name = ? WHERE id = ?', [code, name, memberId], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },
    // Delete a member
    delete: (memberId, callback) => {
        db.query('DELETE FROM members WHERE id = ?', [memberId], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },
};

module.exports = Member;
