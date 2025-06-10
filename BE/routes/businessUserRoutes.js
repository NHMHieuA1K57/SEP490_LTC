const express = require('express');
const router = express.Router();
const { registerBusinessUser, updateBusinessProfile } = require('../controllers/businessUserController');
const { registerValidation } = require('../validations/authValidation');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const upload = require('../utils/upload');

// Business User Routes
router.post('/register-business', upload.single('businessLicenseImage'), registerValidation, registerBusinessUser);
router.patch('/profile', authMiddleware, roleMiddleware(['hotel_owner', 'tour_provider']), upload.array('avatar', 1), updateBusinessProfile);

module.exports = router;