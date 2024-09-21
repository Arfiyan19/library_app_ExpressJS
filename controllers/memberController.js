const Member = require('../models/member');
const Book = require('../models/book');

// Get all members with their borrowed books
exports.getMembers = (req, res) => {
    Member.getAllWithBorrowedBooks((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const members = results.reduce((acc, row) => {
            const member = acc.find(m => m.id === row.id);

            if (member) {
                // If member already exists, add borrowed book details
                member.borrowedBooks.push({
                    book_id: row.book_id,
                    title: row.title,
                    borrowed_date: row.borrowed_date,
                    returned_date: row.returned_date
                });
            } else {
                // Create new member entry if not already present
                acc.push({
                    id: row.id,
                    code: row.code,
                    name: row.name,
                    penalty_until: row.penalty_until,
                    borrowedBooks: row.book_id ? [{
                        book_id: row.book_id,
                        title: row.title,
                        borrowed_date: row.borrowed_date,
                        returned_date: row.returned_date
                    }] : []
                });
            }

            return acc;
        }, []);

        res.status(200).json(members);
    });
};
//crud
// Get a member by ID
exports.getMemberById = (req, res) => {
    const memberId = req.params.id;
    Member.getById(memberId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!result) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(result);
    });
};

// Create a new member
exports.createMember = (req, res) => {
    const { code, name } = req.body;

    if (!code || !name) {
        return res.status(400).json({ error: 'Code and name are required' });
    }

    const newMember = { code, name };
    Member.create(newMember, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Member created successfully', memberId: result.insertId });
    });
};

// Update a member
exports.updateMember = (req, res) => {
    const memberId = req.params.id;
    const { code, name } = req.body;

    if (!code || !name) {
        return res.status(400).json({ error: 'Code and name are required' });
    }

    const updatedMember = { code, name };
    Member.update(memberId, updatedMember, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Member updated successfully' });
    });
};

// Delete a member
exports.deleteMember = (req, res) => {
    const memberId = req.params.id;

    Member.delete(memberId, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Member deleted successfully' });
    });
};
// Borrow a book
exports.borrowBook = (req, res) => {
    const memberId = req.params.memberId; // Member ID from URL
    const { bookId, borrowDate } = req.body; // Book ID and Borrow Date from request body

    // Default to current date if borrowDate is not provided
    const borrowDateValue = borrowDate ? new Date(borrowDate) : new Date();

    // Check if member is under penalty
    Member.checkPenalty(memberId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const penaltyDate = result[0]?.penalty_until;
        if (penaltyDate && new Date(penaltyDate) > new Date()) {
            return res.status(403).json({ error: "Member is currently under penalty" });
        }

        // Check if book is available to borrow
        Book.getBookById(bookId, (err, book) => {
            if (err) {
                return res.status(500).json({ error: "Error checking book availability" });
            }
            if (!book || book.stock <= 0) {
                return res.status(400).json({ error: "Book is not available to borrow" });
            }

            // Borrow the book if available
            Book.borrow(bookId, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Book could not be borrowed" });
                }

                // Record borrowing in borrowed_books table with provided borrowDate
                Member.borrowBook(memberId, bookId, borrowDateValue, (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(200).json({ message: "Book successfully borrowed" });
                });
            });
        });
    });
};


// Return a book
exports.returnBook = (req, res) => {
    const memberId = req.params.memberId; // Member ID from URL
    const { bookId, returnDate } = req.body; // Book ID and Return Date from request body

    // Default to current date if returnDate is not provided
    const returnDateValue = returnDate ? new Date(returnDate) : new Date();

    // Check if member has borrowed the book
    Member.hasBorrowed(memberId, bookId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error checking borrow status" });
        }
        if (!result) {
            return res.status(400).json({ error: "Member has not borrowed this book" });
        }

        const borrowedDate = new Date(result.borrowed_date); // Tanggal peminjaman buku
        const diffTime = Math.abs(returnDateValue - borrowedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Hitung selisih hari

        // Hitung penalti jika pengembalian lebih dari 7 hari
        let penaltyDate = null;
        if (diffDays > 7) {
            penaltyDate = new Date();
            penaltyDate.setDate(penaltyDate.getDate() + 3); // Member dikenakan penalti 3 hari
        }

        // Proceed to return the book
        Book.returnBook(bookId, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error returning the book" });
            }

            // Update return date in borrowed_books table
            Member.returnBook(memberId, bookId, returnDateValue, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Error updating return status" });
                }

                // Jika member dikenakan penalti, update penalti di database
                if (penaltyDate) {
                    Member.setPenalty(memberId, penaltyDate, (err) => {
                        if (err) {
                            return res.status(500).json({ error: "Error setting penalty" });
                        }
                        return res.status(200).json({ message: "Book returned, member is penalized" });
                    });
                } else {
                    res.status(200).json({ message: "Book successfully returned" });
                }
            });
        });
    });
};

// Get all borrowing records
exports.getBorrowingRecords = (req, res) => {
    Member.getAllBorrowingRecords((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Get all return records
exports.getReturnRecords = (req, res) => {
    Member.getAllReturnRecords((err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};