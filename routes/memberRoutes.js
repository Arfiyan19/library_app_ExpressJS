const express = require('express');
const memberController = require('../controllers/memberController');
const router = express.Router();

router.get('/members', memberController.getMembers);
router.post('/members/:memberId/borrow', memberController.borrowBook);
router.post('/members/:memberId/return', memberController.returnBook);

module.exports = router;
