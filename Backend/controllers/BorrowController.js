const sequelize  = require('../config/database');
const { Book, Borrow } = require('../models');
const {
  BookTitleRequiredError,
  BookNotAvailableError,
  BookNotFoundError,
  BookAuthorRequiredError,
  InvalidGenreError,
  BorrowLimitError,
  AlreadyReturnedError,
  NotActiveBorrowError,
} = require('../errors/BookErrors');
const ApiError = require('../errors/ApiError');

//Pour gerer les erreurs
const handleBorrowErrors = (err) => {
  console.log(err.message, err.code);

  if(err.name === 'SequelizeValidationError') {
    err.errors.forEach(e => {
      if (e.path === 'title' && e.validatorKey === 'notEmpty') {
        throw new BookTitleRequiredError();
      }
      else if (e.path === 'author' && e.validatorKey === 'notEmpty') {
        throw new BookAuthorRequiredError();
      }
      else if (e.path === 'genre') {
        throw new InvalidGenreError();
      }
    });
  }

  if (err.message === 'Book Not Found'){
    throw new BookNotFoundError();
  }
  if (err.message === 'Book Not Available'){
    throw new BookNotAvailableError();
  }
  if (err.message === 'Borrow Limit Reached'){
    throw new BorrowLimitError();
  }
  if (err.message === 'No Active Borrow') {
    throw new NotActiveBorrowError();
  }
  if (err.message === 'Already Returned'){
    throw new AlreadyReturnedError();
  }
 
  
  throw new ApiError (500, "Une erreur inattendue s'est produite");
}


//Emprunter un livre
module.exports.borrowBook = async (req, res) => {
  console.log('req.user:', req.user);
  let transaction;
  try{
  //commencer la transaction pour assurer
 transaction = await sequelize.transaction();
  //id du book depuis url
  const { book_id } = req.params;
  //id du user authetifier
  const user_id = req.user.id;
  console.log('Book ID:', book_id); 
  console.log('User ID:', req.user.id);
  console.log('Transaction:', transaction); 
//verifier si le livre existe et sa disponibilité
const book = await Book.findByPk(book_id, {transaction});
if (!book){
 await transaction.rollback();
  throw new Error ('Book Not Found');
}
if(!book.available){
  await transaction.rollback();
  throw new Error ('Book Not Available');
}

//verifier si le user a depaser ses nbr de livre emprunter
const existingEmprunt = await Borrow.findOne({
  where : { user_id, return_date: null},
  transaction
});
if (existingEmprunt){
 await transaction.rollback();
  throw new Error('Borrow Limit Reached');
}

//Emprunt

const borrow = await Borrow.create({
  user_id,
  book_id,
  
  borrow_date: new Date()
},{ transaction: transaction });

await book.update({available: false}, {transaction: transaction });
//valider les changement
await transaction.commit();
res.json({
success: true,
borrow_id: borrow.id
});
  }
catch (err){
try {
  handleBorrowErrors(err);
} catch(error){
  if (error instanceof ApiError) {
    return res.status(error.statutsCode).json({
      success: false,
      error: {
        type: error.name,
        message: error.message,
        ...(error.details && {details: error.details})
      }
    });
  }
//For les erreurs non gerer
return res.status(500).json({
  success: false,
  error: {
    message: "Une erreur inattendue s'est produite"
  }
});
   }
  }
}


//retourner  un livre emprunter
module.exports.returnBook = async (req, res) => {
  try {
const transaction = await sequelize.transaction();
const {book_id} = req.params;
const user_id = req.user.id; 
//Trouver le livre emprunte
const borrow = await Borrow.findOne({
  where: {
    book_id,
    user_id,
    return_date: null
  },
  transaction
});

if(!borrow){
await transaction.rollback();
throw new Error ('No Active Borrow');
}

if (borrow.return_date !== null) {
  await transaction.rollback();
  throw new Error('Already Returned');
}

//marquer livre comme rendu
await borrow.update({ return_date: new Date()}, {transaction});

//render le livre available
await Book.update({available: true},
   {where:{ id: book_id},
    transaction });

    await transaction.commit();
    res.json({ success: true });

} catch (err) {
  try {
    handleBorrowErrors(err);
  } catch(error) {
    if (error instanceof ApiError) {
      return res.status(error.statutsCode).json({
        success: false,
        error: {
          type: error.name,
          message: error.message,
          ...(error.details && { details: error.details})
        }
      });
    }

    return res.status(500).json({
      success: false,
      error :{ message: "Une erreur inattendue s'est produite"}
    });
  }
}
}

//Logs 
module.exports.userBorrowsLogs = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const logs = await Borrow.findAll({
      where: { user_id },
      include: [{
        model: Book,
        attributes: ['id', 'title', 'author'] 
      }],
      order: [['borrow_date', 'DESC']] 
    });

    res.status(200).json({
      success: true,
      logs: logs.map(record => ({
        id: record.id,
        book_id: record.bookId,
        title: record.Book.title,
        author: record.Book.author,
        borrow_date: record.borrow_date?.toISOString(),
        return_date: record.return_date?.toISOString(),
        status: record.returnDate ? 'returned' : 'borrowed'
      }))
    });

  } catch (err) {
    try {
      handleBorrowErrors(err);
    } catch(error) {
      if (error instanceof ApiError) {
        return res.status(error.statutsCode).json({
          success: false,
          error: {
            type: error.name,
            message: error.message,
            ...(error.details && { details: error.details })
          }
        });
      }
      return res.status(500).json({
        success: false,
        error: {
          message: "Une erreur inattendue s'est produite"
        }
      });
    }
  }
};

exports.activeBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      where: { 
        user_id: req.user.id,
        return_date: null 
      },
      include: [{ model: Book }]
    });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};