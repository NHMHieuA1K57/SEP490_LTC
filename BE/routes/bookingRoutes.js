const express = require('express');
const bookingController = require('../controllers/bookingController.js');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['customer', 'hotel_owner']), bookingController.getBookings);
router.get('/:bookingId', authMiddleware, roleMiddleware(['customer', 'hotel_owner']), bookingController.getBookingById);
router.put('/confirm/:bookingId', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.confirmBooking);
router.put('/cancel/:bookingId', authMiddleware, roleMiddleware(['customer', 'hotel_owner']), bookingController.cancelBooking);
router.get('/history', authMiddleware, roleMiddleware(['customer', 'hotel_owner']), bookingController.getBookingHistory);
router.post('/', authMiddleware, roleMiddleware(['customer']), bookingController.createBooking);
router.post('/checkout/:bookingId', authMiddleware, roleMiddleware(['customer', 'hotel_owner']), bookingController.checkoutBooking);

//wallet
router.post('/wallet/withdrawal', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.requestWithdrawal);
router.post('/wallet/withdrawal/confirm', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.confirmWithdrawal);
router.get('/wallet/details', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.getWalletDetails);

//refunds
router.post('/payment/failure/:bookingId', authMiddleware, bookingController.handlePaymentFailure);
router.post('/refund/:bookingId', authMiddleware, roleMiddleware(['customer']), bookingController.requestRefund);


module.exports = router;