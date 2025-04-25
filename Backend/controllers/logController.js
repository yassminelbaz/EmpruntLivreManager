const logService = require('../services/logService');
const ApiError = require('../errors/ApiError');

module.exports = {
  getLogs: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const logs = await logService.getAdminLogs(parseInt(page), parseInt(limit));
      
      res.json({
        success: true,
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      throw new ApiError(500, "Erreur lors de la récupération des logs");
    }
  }
};