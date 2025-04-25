const {DataTypes} = require ('sequelize');
const database = require ('../config/database');
const bcrypt = require('bcrypt');



//creat our model the tabl that we want to create in our db 
const User = database.define('User',{
  name:{
   type: DataTypes.STRING

  },

  role :{
 type: DataTypes.ENUM('admin', 'etudiant')

  },

  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg : 'email already registred'
    },
    validate:{
      notEmpty: {msg: 'Veuillez entrer un email'},
      
      isEmail: {
        msg: 'format email is not valide'}

    }
  },

  password:{
    type : DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty: {msg: 'Veuillez entrer un password'},
      len : {
        args:  [8, Infinity],
        msg : 'Minimun password lenght is 8 caracteres'
            }
    }
    
  }}, {
    tableName : 'users',
    timestamps: false,
    hooks:{
      //before doc saved to db
      beforeCreate: async (user) => {
        console.log('user about to be created', user.toJSON());
      //hasher le mdp
        if (user.password){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      },
      //after doc saved to db 
      afterCreate: (user) => {
        console.log('user was created and saved ',user.toJSON());
      }
    }
  
});

//methode statique pour se connecter utilisateur
User.login = async function (email, password){
  if (!email){
    throw new Error ("Email Required");
  }

  if (!password) {
    throw new Error("Password Required");
  }

  const user = await this.findOne ({where: {email}});
  if(!user){
    throw new Error ("Email Incorrect")
  }

  //verification du mot d passe
   const auth = await bcrypt.compare(password, user.password);
   if(!auth){
    throw new Error ("Password Incorrect");
   }
 return user;


};



module.exports = User;