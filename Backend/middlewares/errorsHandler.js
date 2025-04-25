const ApiError = require("../errors/ApiError");

//1est params is an err + 4 params  =>expres knows its an errorhandler middleware
function errorsHandler(err, req, res, next){

 const statusCode = err.statusCode || 500;


 //reponse standarisé
 res.status(statusCode).json({
  succes : false,
  error: {
    type: err.name || 'ServerError',
    message: err.message || 'Quelque chose a mal tourné',
    ...(err.details && {details: err.details})
  }
 });

}
module.exports = errorsHandler; 