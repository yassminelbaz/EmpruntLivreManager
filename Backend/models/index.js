const Sequelize = require('sequelize');
const sequelize  = require('../config/database');

const User = require('./User');
const Book = require('./Book');
const Borrow = require('./Borrow');
const LogAdmin = require('./LogAdmin');

// Associer les modèles
const associate = require('./Association');
associate({ User, Book, Borrow, LogAdmin });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Book,
  Borrow,
  LogAdmin
};
