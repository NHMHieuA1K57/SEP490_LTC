const express = require('express');
const router = express.Router();
const { getPendingBusinessUsers, verifyBusinessUser } = require('../controllers/adminController');
const {  verifyBusinessValidation } = require('../validations/authValidation');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Admin Routes
router.get('/pending-business-users', authMiddleware, roleMiddleware(['admin']), getPendingBusinessUsers);
router.post('/verify-business', authMiddleware, roleMiddleware(['admin']), verifyBusinessValidation, verifyBusinessUser);

module.exports = router;