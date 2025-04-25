const errorsMessages = require('../utils/errorsMessages');
const ApiError = require('./ApiError');

//authentification
class EmailFormatError extends ApiError{
  constructor(){
    super(400, errorsMessages.EMAIL.INVALID,
    {email: "email invalide ex: user@example.com"
  });
}
}

class EmailRequiredError extends ApiError{
  constructor(){
    super(400, errorsMessages.EMAIL.REQUIRED,
    {email: "Ce champs ne peut pas etre vide"
  });
}
}

class EmailUsedError extends ApiError{
  constructor(){
    super(400, errorsMessages.EMAIL.USED,
    {email: "Ce email est deja utilisé"
  });
}
}

class EmailIncorrectError extends ApiError{
  constructor(){
    super(400, errorsMessages.EMAIL.INCORRECT,
    {email: "L'email est incorrect"
  });
}
}

class PasswordRequiredError extends ApiError{
  constructor(){
    super(400, errorsMessages.PASSWORD.REQUIRED,
    {email: "Ce champs ne peut pas etre vide"
  });
}
}

class PasswordFormatError extends ApiError{
  constructor(){
    super(400, errorsMessages.PASSWORD.INVALID,
    {email: "8 caractères minimun requis"
  });
}
}

class PasswordIncorrectError extends ApiError{
  constructor(){
    super(400, errorsMessages.PASSWORD.INCORRECT,
    {email: "Le mot de passe est incorrect"
  });
}
}


module.exports = {EmailFormatError, EmailRequiredError,PasswordFormatError, PasswordRequiredError, EmailUsedError, EmailIncorrectError, PasswordIncorrectError};