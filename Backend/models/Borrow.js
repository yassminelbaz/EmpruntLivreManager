const {DataTypes} = require('sequelize');
const database = require('../config/database');


const Borrow = database.define('Borrow',{
  borrow_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  tableName: 'borrows',
  timestamps: false
},);



module.exports = Borrow;