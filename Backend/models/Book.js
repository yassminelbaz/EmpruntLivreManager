const {DataTypes} = require('sequelize');
const database = require('../config/database');
const Borrow = require('./Borrow');


const Book = database.define('Book',{
  title:{
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  author:{
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  genre:{
    type: DataTypes.ENUM('Mathematique', 'Physique', 'Informatique')
  },
  description:{
    type: DataTypes.STRING,
    allowNull: false
  },
  available:{
    type: DataTypes.BOOLEAN,
    defaultValue: true

  },
},{
  tableName : 'books',
  timestamps : true
});



module.exports = Book;