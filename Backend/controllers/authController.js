const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { EmailUsedError, EmailFormatError, EmailRequiredError, PasswordFormatError, PasswordRequiredError, EmailIncorrectError, PasswordIncorrectError } = require('../errors/FormErrors');
const ApiError = require('../errors/ApiError');
require ('dotenv').config();

//function to handl errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {email:'', password: ''};


  
  if (err.message === 'Email Incorrect'){
    throw new EmailIncorrectError();
  }
  if (err.message === 'Password Incorrect'){
    throw new PasswordIncorrectError();
  }
  
  if (err.message === 'Email Required'){
    throw new EmailRequiredError();
  }
  if (err.message === 'Password Required'){
    throw new PasswordRequiredError();
  }

  
  if (err.name === 'SequelizeUniqueConstraintError') {
    throw new EmailUsedError();
  }

 
  if (err.name === 'SequelizeValidationError') {
   
    err.errors.forEach(e =>{
      if (e.path === 'email'){
        if(e.validatorKey === 'isEmail'){
          throw new EmailFormatError();
        }
        else if (e.validatorKey === 'notEmpty'){
          throw new EmailRequiredError();
        }  
      }  
      else if (e.path ==='password'){
        if(e.validatorKey === 'len'){
          throw new PasswordFormatError();
        }
        else if (e.validatorKey === 'notEmpty'){
          throw new PasswordRequiredError();
        }
      }
      
    });
    
  }
    return errors;
    };

    //ceating jwt token
    const maxAge = 3*24*60*60; //value in seconds
    const createToken = (id, role) => {
      return jwt.sign({ id, role }, process.env.ACCES_TOKEN_SECRET,{
        expiresIn: maxAge
      });
    };
 
   

//controller functions
module.exports.signup_get = (req,res) => {
  res.render('signup');
};

module.exports.login_get = (req,res) => {
  res.render('login');
};

module.exports.signup_post = async (req,res) => {
  
  const {name, role,email, password} = req.body;
  
  try{

  const user = await  User.create({ name, role, email, password }); 
  
  const token = createToken(user.id, user.role);
  res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
  res.status(201).json({
    user: user.id,
    token: token 
  });
  }
  catch(err){
    try{
      //pour les erreur specifique
      handleErrors(err);
    } catch(error){
      if(error instanceof ApiError){
        return res.status(error.statutsCode).json({
              success: false,
              error: {
                type: error.name,
                message: error.message,
                ...(error.details && {details: error.details})
              }
        });
      }
    }
    
  const errors =  handleErrors(err);
  res.status(400).json({errors});
  }

};


//Login 
module.exports.login_post = async (req,res) => {
 const {email, password} = req.body;

 try{
const user = await User.login(email,password);

//create a json web token for the user that logged in 
const token = createToken(user.id, user.role);
  res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});

  res.status(200).json({ user:{
    id:user.id,
    name: user.name,
    email: user.email,
    role: user.role
  },
  token: token
});

 }
 catch (err){
const errors = handleErrors(err);
res.status(400).json({ errors });
 }

};


module.exports.logout_get = (req, res) => {
//we need to delete jwt cookie
//from the server we cant delet cookies
//so we gonna replace it with a blank cokie with avery short lifespan

res.cookie('jwt', '', {maxAge: 1});

};