class ApiError extends Error {
  constructor(statutsCode, message, details){
    //constructeur de base
    super(message);
    //status code
    this.statutsCode = statutsCode;
    
    this.details = details;
    //enregistrer les erreur produite
    Error.captureStackTrace(this);
  }

}

module.exports = ApiError;