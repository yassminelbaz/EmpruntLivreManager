const { sequelize } = require('../config/database');
const Book = require ('../models/Book');
const Borrow = require('../models/Borrow');
const {
  BookTitleRequiredError,
  BookAuthorRequiredError,
  InvalidGenreError,
  NoChangeError,
  InvalidIDError
} = require('../errors/BookErrors');
const ApiError = require('../errors/ApiError');
const { Op } = require('sequelize');
const logService = require('../services/logService');



//Pour gerer les erreurs
const handleBookErrors = (err) => {
  console.log(err.message, err.code);
  
  if (err.message === 'No Changes'){
    throw new NoChangeError();
  }
  if (err.message === 'Title Required'){
    throw new BookTitleRequiredError();
  }
  if (err.message === 'Author Required'){
    throw new BookAuthorRequiredError();
  }
  if (err.message === 'Invalid Genre'){
    throw new InvalidGenreError();
  }
  if (err.message === 'Invalid ID'){
    throw new InvalidIDError();
  }
  if (err.message === 'Search Term Required') {
    throw new SearchTermRequiredError();
  }

  throw new ApiError (500, "Une erreur inattendue s'est produite");
}

//Lister tout les livres
module.exports.listBooks = async (req, res) => {
  console.log('req.user:', req.user);
const books = await Book.findAll({})
res.status(200).send(books)
}

//lister les ivres par genre 
module.exports.listBookByGenre = async (req, res) => {
  const genre = req.params.genre
  const books = await Book.findAll({where: {genre: genre} })
  res.status(200).send(books)
  }
  
//lister les ivres par disponibillité
module.exports.listBookByAvailability = async (req, res) => {
  const available = req.params.available === 'true';
  const books = await Book.findAll({where: {available: available} })
  res.status(200).send(books)
  }

//Search bare 
module.exports.searchBooks = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    
    if (!searchTerm || searchTerm.trim() === '') {
      throw new Error('Search Term Required');
    }

    // Case-insensitive search compatible with MySQL
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { 
            title: { 
              [Op.like]: `%${searchTerm}%` 
            } 
          },
          { 
            author: { 
              [Op.like]: `%${searchTerm}%` 
            } 
          },
          { 
            description: { 
              [Op.like]: `%${searchTerm}%` 
            } 
          }
        ]
      }
    });

    res.status(200).send(books);
  } catch (err) {
    try {
      handleBookErrors(err);
    } catch (error) {
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
          message: "Une erreur inattendue s'est produite lors de la recherche"
        }
      });
    }
  }
};

//CRUD POUR ADMIN
//creer un nouveau livre
module.exports.createBook = async (req, res) => {
  console.log('req.user:', req.user);
try {
const info = {
  title : req.body.title,
  author : req.body.author,
  genre: req.body.genre,
  description : req.body.description
  
};
if (!info.title) {
  throw new Error('Title Required');
}
if(!info.author) {
  throw new Error('Author Required');
}
if(!['Mathematique','Physique','Informatique'].includes(info.genre)) {
  throw new Error('Invalid Genre');
}

const book = await Book.create(info)
await logService.logAction(req.user.id, 'BOOK_CREATE', book.id, `Création du livre: ${book.title}`, req.ip);
res.status(200).json({
  success: true,
  book: book
});
}
catch(err) {
  try{
    handleBookErrors(err);
  } catch(error){
    if (error instanceof ApiError){
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
      error: {
        message: "Une erreur inattendue s'est produite"
      }
    });
  }
}
};

//modifier un livre
module.exports.updateBook = async (req, res) => {
  try {
  //extraction du id depuis url
const id = req.params.id;
const updates = req.body
//Si aucun modification a ete reliser
if(Object.keys(updates).length === 0){
  throw new Error ('No Changes');
} 

  const [updated] = await Book.update(
  updates,        //nouvelle valeur
  {where: { id } } //condition
);

if (updated === 0){
  throw new Error('Book Not Found');
}
await logService.logAction(req.user.id, 'BOOK_UPDATE', id, `Mise à jour: ${JSON.stringify(updates)}`, req.ip);
res.status(200).json({ success: true });
  } catch(err) {
    try {
      handleBookErrors(err);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status( error.statutsCode ).json({
          success: false,
          error: {
            type: error.name,
            message: error.message,
            ...(error.details && {details: error.details})
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
}

//suprimer un livre
module.exports.deleteBook = async (req, res) => {
  try {
const id = req.params.id;

if(!id || isNaN(id)) {
  throw new Error('Invalid ID');
}
const book = await Book.findByPk(id);
if(!book) {
  throw new Error ('Book Not Found');
}

const activeBorrow = await Borrow.findOne({
  where: {
    book_id: id,
    return_date: null
  }
});
if  (activeBorrow) {
  throw new Error('Book Not Available');
}

await Book.destroy({where : {id: id}})
await logService.logAction(req.user.id, 'BOOK_DELETE', id, `Suppression du livre ID: ${id}`, req.ip);
res.status(200).json  ({
  success: true,
  message: 'Livre supprimé avec succès'
});
  }
  catch (err){
    try {
      handleBookErrors(err);
    } catch(error)
    {
      if (error instanceof ApiError) {
        return res.status( error.statutsCode ).json({
          success: false,
          error: {
            type: error.name,
            message: error.message,
            ...(error.details && {details: error.details})
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
}

