const express = require('express');
const router = express.Router();
const { registerBusinessUser } = require('../controllers/businessUserController');
const { registerValidation } = require('../validations/authValidation');
const upload = require('../utils/upload');

// Business User Routes
router.post('/register-business', upload.single('businessLicenseImage'), registerValidation, registerBusinessUser);

module.exports = router;