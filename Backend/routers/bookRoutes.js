const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const {Router } = require('express');
const bookController = require('../controllers/bookController');
const borrowController = require('../controllers/BorrowController');



const route = Router();


route.get('/books', bookController.listBooks);
route.get('/books/genre/:genre', bookController.listBookByGenre);
route.get('/availability/:available', bookController.listBookByAvailability);
route.get('/books/search', bookController.searchBooks);
route.post('/books/borrow/:book_id', requireAuth , borrowController.borrowBook);
route.post('/books/return/:book_id', requireAuth, borrowController.returnBook);




//Routes CRUD pour admin
route.post('/books', requireAuth,requireRole('admin'), bookController.createBook);
route.patch('/books/:id', requireAuth,requireRole('admin'), bookController.updateBook);
route.delete('/books/:id', requireAuth,requireRole('admin'), bookController.deleteBook);

//logs
route.get('/borrow/logs', requireAuth, requireRole('etudiant'), borrowController.userBorrowsLogs);
// Ajouter dans votre routeur
route.get('/borrow/active', requireAuth, borrowController.activeBorrows);
module.exports = route;