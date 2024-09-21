
const express = require('express');
const bookController = require('../controllers/bookController');
const memberController = require('../controllers/memberController');
const router = express.Router();
// Book routes
router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById);  
router.post('/books', bookController.createBook);  
router.put('/books/:id', bookController.updateBook);  
router.delete('/books/:id', bookController.deleteBook); 
// Member routes
router.get('/members', memberController.getMembers);
router.get('/members/:id', memberController.getMemberById); 
router.post('/members', memberController.createMember);  
router.put('/members/:id', memberController.updateMember);  
router.delete('/members/:id', memberController.deleteMember);  


//route peminjaman dan pengembalian
router.get('/borrowings', memberController.getBorrowingRecords);  
router.post('/members/:memberId/borrow', memberController.borrowBook);
router.post('/members/:memberId/return', memberController.returnBook);
router.get('/returns', memberController.getReturnRecords); 


module.exports = router;
