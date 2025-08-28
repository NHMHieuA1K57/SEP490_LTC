const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/notificationController');

router.post('/broadcast', authMiddleware, roleMiddleware(['admin']), ctrl.broadcast);
router.get('/me', authMiddleware, ctrl.listForMe);
router.get('/me/unread-count', authMiddleware, ctrl.unreadCount);
router.post('/me/:deliveryId/read', authMiddleware, ctrl.markRead);
router.post('/me/read-all', authMiddleware, ctrl.markAllRead);

module.exports = router;
