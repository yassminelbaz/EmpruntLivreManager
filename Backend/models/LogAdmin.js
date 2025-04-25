const { DataTypes } = require('sequelize');
const database = require('../config/database');

const LogAdmin = database.define('LogAdmin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  actionType: {
    type: DataTypes.ENUM(
      'BOOK_CREATE',
      'BOOK_UPDATE',
      'BOOK_DELETE',
      'USER_MODIFICATION',
      'SYSTEM_ACTION'
    ),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'admin_logs',
  timestamps: true
});

module.exports = LogAdmin;