const express = require('express');
const router = express.Router();
const bookingRepository = require('../repositories/bookingRepository');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

router.post('/payos-webhook', async (req, res) => {
  try {
    const { orderCode, status } = req.body;

    if (status !== 'PAID') {
      return res.status(200).json({ message: 'Không cần xử lý nếu chưa thanh toán thành công' });
    }

    const bookingCode = `BOOK${orderCode}`;
    const booking = await Booking.findOne({ 'paymentInfo.bookingCode': bookingCode });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking' });
    }

    // Cập nhật trạng thái booking
    booking.status = 'confirmed';
    booking.paymentInfo.payoutStatus = 'paid';
    await booking.save();

    // Cập nhật trạng thái payment
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment) {
      payment.status = 'completed';
      payment.paymentDate = new Date();
      await payment.save();
    }

    console.log('✅ Đã cập nhật trạng thái booking & payment');

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Webhook lỗi:', err);
    return res.status(500).json({ message: 'Lỗi server khi xử lý webhook' });
  }
});


module.exports = router;