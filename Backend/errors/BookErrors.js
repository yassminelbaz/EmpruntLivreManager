const Borrow = require('../models/Borrow');
const errorsMessages = require('../utils/errorsMessages');
const ApiError = require('./ApiError');



class BookNotFoundError extends ApiError {
  constructor()
  {
    super(404, errorsMessages.BOOK.NOT_FOUND, {book: "Acun livre correspondant a cet ID, verifier l'ID ou contactez l'admin"});
  }
}

class BookNotAvailableError extends ApiError{
  constructor(){
    super(400, errorsMessages.BOOK.NOT_AVAILABLE , {book: "Ce livre est actuellement indisponible" });
  }
}

class BookTitleRequiredError extends ApiError{
  constructor(){
    super(400, errorsMessages.BOOK.TITLE_REQUIRED, {
      title: "le champ titre ne peut pas etre vvide"
    });
  }
}

class BookAuthorRequiredError extends ApiError{
  constructor(){
    super(400, errorsMessages.BOOK.AUTHOR_REQUIRED, {
      auteur: "le champ auteur ne peut pas etre vvide"
    });
  }
}

class InvalidGenreError extends ApiError {
  constructor() {
    super(400, errorsMessages.BOOK.INVALID_GENRE, {
      genre: "Genres valides : Mathematique, Physique, Informatique"
    });
  }
}

class BorrowLimitError extends ApiError {
  constructor(){
    super(400, errorsMessages.BORROW.LIMIT_REACHED, {
      user: "Vous avez atteint votre limite d'emprunt"
    });
  }
}

class NotActiveBorrowError extends ApiError {
  constructor(){
    super(400, errorsMessages.BORROW.NO_ACTIVE, {
      Borrow: "Aucun emprunt a retourner pour ce livre "
    });
  }
}

class AlreadyReturnedError extends ApiError {
  constructor(){
    super(400, errorsMessages.BORROW.ALREADY_RETURNED, {
      borrow: "Ce livre a deja retourné"
    });
  }
}

class NoChangeError extends ApiError {
  constructor(){
    super(400, errorsMessages.VALIDATION.NO_CHANGES, {
      id: "Aucune donné validé a mettre a jour"
  });
}
}

class InvalidIDError extends ApiError {
  constructor(){
    super(400, errorsMessages.VALIDATION.INVALID_ID, {
      id: "L'ID fourni est invalide"
    });
  }
}

class SearchTermRequiredError extends ApiError {
  constructor() {
    super(400, 'SearchTermRequiredError', 'Un terme de recherche est requis');
  }
}

module.exports = {
  BookAuthorRequiredError,
  BookNotAvailableError,
  BookNotFoundError,
  BookTitleRequiredError,
  InvalidGenreError,

  BorrowLimitError,
  NotActiveBorrowError,
  AlreadyReturnedError,

  NoChangeError,
  InvalidIDError,

  SearchTermRequiredError
};