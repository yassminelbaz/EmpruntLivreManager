const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//check the authetication states and it'll be applied on avery routes that needs the users to be logged in
const  requireAuth = (req, res, next) =>{
//grab the token from the cookies
const token = req.cookies.jwt;
if (!token) {
  return res.status(401).json({ message: 'Token non fourni.' });
}
//check if jwt exists & its verified

 jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, decodedToken)=>{
    if(err){
      console.log(err.message);
      return res.status(401).json({ message: 'Token invalide' });
    }
    console.log(decodedToken);
      req.user = decodedToken;
      
      next();
    
 });

}

//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, async (err, decodedToken)=>{
      if(err){
        console.log(err.message);
        res.locals.user = null;
        next(); 
      }
      else {
        let user = await User.findById(decodedToken.id);
        //inject user in our views
        res.locals.user = user;
        next();
      }
    
   });
  }
  else {
    res.locals.user = null;
    next(); 
  } 
  
  }

  const requireRole = (role) => {
    return (req, res, next) => {
      // requireAuth s’est déjà assuré que req.user existe et est valide
      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Accès interdit : rôle insuffisant.' });
      }
  
      next();
    };
  };

module.exports = {requireAuth, checkUser, requireRole};
