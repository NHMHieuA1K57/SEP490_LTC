const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-paypal-order', paymentController.createPayPalOrder);
router.get('/payment-success', paymentController.capturePayPalPayment);
router.get('/payment-cancel', (req, res) => res.send('Đã huỷ thanh toán'));

module.exports = router;
