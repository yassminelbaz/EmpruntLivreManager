const { Router } = require('express');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const logController = require('../controllers/logController');

const router = Router();

router.get('/admin/logs', requireAuth, requireRole('admin'), logController.getLogs);

module.exports = router;