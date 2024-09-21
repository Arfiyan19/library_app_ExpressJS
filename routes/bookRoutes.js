const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.get('/books', bookController.getBooks);

module.exports = router;
