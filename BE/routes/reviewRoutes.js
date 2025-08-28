const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const canReplyToReview = require('../middleware/canReplyToReview');

// Tạo review (khách đã đăng nhập)
router.post('/reviews', authMiddleware, ctrl.create);

// Danh sách review (public)
router.get('/reviews', ctrl.list);

// Vote helpful (đăng nhập, chặn tự vote đã xử lý ở service)
router.post('/reviews/:id/helpful', authMiddleware, ctrl.helpful);

// Reply (provider/hotel_owner/admin) + kiểm đúng owner bằng middleware
router.post(
  '/reviews/:id/replies',
  authMiddleware,
  roleMiddleware(['tour_provider','hotel_owner','admin']),
  canReplyToReview,
  ctrl.reply
);

// Đổi status (admin)
router.patch('/reviews/:id', authMiddleware, roleMiddleware(['admin']), ctrl.changeStatus);

// Xoá review (admin)
router.delete('/reviews/:id', authMiddleware, roleMiddleware(['admin']), ctrl.delete);

// Report review (user đăng nhập, chặn tự report ở service)
router.post('/reviews/:id/report', authMiddleware, ctrl.report);

// Quản lý report (admin)
router.get('/review-reports', authMiddleware, roleMiddleware(['admin']), ctrl.listReports);
router.patch('/review-reports/:id', authMiddleware, roleMiddleware(['admin']), ctrl.handleReport);

module.exports = router;
