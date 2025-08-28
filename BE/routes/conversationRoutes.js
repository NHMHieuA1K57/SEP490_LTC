const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const conversationController = require('../controllers/conversationController');

// tất cả API cần login
router.use(authMiddleware);

// Lấy list hội thoại của user (customer hoặc provider)
router.get('/', conversationController.getMyConversations);

// Lấy chi tiết + messages
router.get('/:id', conversationController.getConversation);

// Gửi tin nhắn
router.post('/:id/message', conversationController.sendMessage);

module.exports = router;
