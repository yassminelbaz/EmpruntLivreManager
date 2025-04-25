const { LogAdmin } = require('../models');

module.exports = {
  logAction: async (adminId, actionType, bookId = null, details = null, ipAddress = null) => {
    try {
      await LogAdmin.create({
        admin_id: adminId,
        actionType,
        book_id: bookId,
        details,
        ipAddress
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  },

  getAdminLogs: async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    return await LogAdmin.findAll({
      include: [
        { model: require('../models/User'), attributes: ['id', 'name', 'email'] },
        { model: require('../models/Book'), attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
  }
};