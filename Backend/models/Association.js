module.exports = (models) => {
  const { User, Book, Borrow, LogAdmin } = models;

  User.hasMany(Borrow, { foreignKey: 'user_id' });
  Borrow.belongsTo(User, { foreignKey: 'user_id' });

  Book.hasMany(Borrow, { foreignKey: 'book_id' });
  Borrow.belongsTo(Book, { foreignKey: 'book_id' });

  User.hasMany(LogAdmin, { foreignKey: 'admin_id' });
  LogAdmin.belongsTo(User, { foreignKey: 'admin_id' });

  Book.hasMany(LogAdmin, { foreignKey: 'book_id' });
  LogAdmin.belongsTo(Book, { foreignKey: 'book_id' });
};
