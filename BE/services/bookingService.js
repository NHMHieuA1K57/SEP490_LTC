const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();
const PayOS = require('@payos/node');

const BookingRepository = require('../repositories/bookingRepository');
const HotelRepository = require('../repositories/hotelRepository');
// const roomRepository = require('../repositories/roomRepository');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { sendNotificationEmail, generateOTP } = require('../utils/sendMail');

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.API_KEY,
  process.env.CHECKSUM_KEY
);

const getBookingsService = async (ownerId, filters) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map((hotel) => hotel._id);

  if (!hotelIds.length) {
    return { success: true, message: 'Không có khách sạn nào để xem đặt phòng', data: [] };
  }

  const bookings = await BookingRepository.findBookingsByHotelIds(hotelIds, filters);
  return { success: true, message: 'Lấy danh sách đặt phòng thành công', data: bookings };
};

const getBookingByIdService = async (ownerId, bookingId) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map((hotel) => hotel._id);

  if (!hotelIds.length) {
    throw new Error('Bạn không sở hữu khách sạn nào');
  }

  const booking = await BookingRepository.findBookingById(bookingId, hotelIds);
  if (!booking) {
    throw new Error('Đặt phòng không tồn tại hoặc bạn không có quyền truy cập');
  }

  return { success: true, message: 'Lấy chi tiết đặt phòng thành công', data: booking };
};

const confirmBookingService = async (ownerId, bookingId) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map((hotel) => hotel._id);

  if (!hotelIds.length) {
    throw new Error('Bạn không sở hữu khách sạn nào');
  }

  const booking = await BookingRepository.confirmBooking(bookingId, hotelIds);
  return { success: true, message: 'Xác nhận đặt phòng thành công', data: booking };
};

const cancelBookingService = async (ownerId, bookingId, reason) => {
  if (!reason) {
    throw new Error('Lý do hủy là bắt buộc');
  }

  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map((hotel) => hotel._id);

  if (!hotelIds.length) {
    throw new Error('Bạn không sở hữu khách sạn nào');
  }

  const booking = await BookingRepository.cancelBooking(bookingId, hotelIds, reason);
  return { success: true, message: 'Hủy đặt phòng thành công', data: booking };
};

const getBookingHistoryService = async (ownerId, filters) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  const hotelIds = hotels.map((hotel) => hotel._id);

  if (!hotelIds.length) {
    return { success: true, message: 'Không có khách sạn nào để xem lịch sử đặt phòng', data: [] };
  }

  const bookings = await BookingRepository.findBookingHistory(hotelIds, filters);
  return { success: true, message: 'Lấy lịch sử đặt phòng thành công', data: bookings };
};

const bookingService = {
  async createBookingService(userId, hotelId, details, paymentMethod = 'payos') {
    const booking = await BookingRepository.createBooking(userId, hotelId, details, paymentMethod);
    const YOUR_DOMAIN = process.env.REACT_URL || `http://localhost:${process.env.PORT}`;
    const expirationTime = Math.floor(Date.now() / 1000) + 600;

    const order = {
      amount: booking.totalPrice,
      description: `Thanh toán đặt phòng ${booking._id}`,
      orderCode: Math.floor(10000000 + Math.random() * 90000000),
      expiredAt: expirationTime,
      returnUrl: `${YOUR_DOMAIN}/api/bookings/payment-success/${booking._id}`,
      cancelUrl: `${YOUR_DOMAIN}/api/bookings/payment-cancel/${booking._id}`,
    };

    try {
      const paymentLink = await payos.createPaymentLink(order);
      booking.paymentLink = paymentLink.checkoutUrl;
      booking.paymentInfo.paymentMethod = paymentMethod;
      await booking.save();

      const payment = new Payment({
        amount: booking.totalPrice,
        bookingId: booking._id,
        status: 'pending',
        paymentMethod,
      });
      await payment.save();

      const transaction = new Transaction({
        bookingId: booking._id,
        userId,
        type: 'payment',
        amount: booking.totalPrice,
        method: paymentMethod,
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentLinkId: paymentLink.checkoutUrl,
        details: { businessUserId: (await BookingRepository.getHotelById(hotelId)).ownerId },
      });
      await transaction.save();

      return { checkoutUrl: paymentLink.checkoutUrl, bookingId: booking._id };
    } catch (error) {
      await Booking.findByIdAndDelete(booking._id);
      throw new Error(`Lỗi tạo link thanh toán: ${error.message}`);
    }
  },

  async checkoutBookingService(bookingId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({ _id: bookingId, userId, status: 'confirmed' }).session(session);
      if (!booking) {
        throw new Error('Booking không tồn tại hoặc không thể check-out.');
      }

      const now = new Date('2025-06-13T16:37:00+07:00');
      if (new Date(booking.details.checkOutDate) > now) {
        throw new Error('Check-out chưa đến thời gian cho phép.');
      }

      booking.status = 'completed';
      await booking.save({ session });

      const paymentTransaction = await Transaction.findOne({ bookingId, type: 'payment' }).session(session);
      if (!paymentTransaction || paymentTransaction.status !== 'completed') {
        throw new Error('Giao dịch thanh toán không hợp lệ.');
      }

      const commissionRate = 0.1;
      const commission = paymentTransaction.amount * commissionRate;
      const partnerPayoutAmount = paymentTransaction.amount - commission;

      paymentTransaction.status = 'completed';
      paymentTransaction.details.commission = commission;
      paymentTransaction.details.completedAt = now;
      await paymentTransaction.save({ session });

      const businessUserId = paymentTransaction.details.businessUserId;
      const businessUserEmail = (await BookingRepository.getUserById(businessUserId)).email;

      let wallet = await Wallet.findOne({ userId: businessUserId }).session(session);
      if (!wallet) {
        wallet = new Wallet({ userId: businessUserId });
      }
      wallet.pendingBalance -= paymentTransaction.amount;
      wallet.balance += partnerPayoutAmount;
      wallet.transactions.push(paymentTransaction._id);
      await wallet.save({ session });

      const payoutTransaction = new Transaction({
        bookingId,
        userId: businessUserId,
        type: 'payout',
        amount: partnerPayoutAmount,
        method: 'bank_transfer',
        transactionId: `PAYOUT-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'completed',
        details: { businessUserId, completedAt: now },
      });
      await payoutTransaction.save({ session });

      const notification = new Notification({
        userId: businessUserId,
        type: 'booking_status',
        content: `Booking ${bookingId} đã hoàn tất check-out. Số tiền ${partnerPayoutAmount} VND đã được chuyển vào ví.`,
      });
      await notification.save({ session });

      await sendNotificationEmail(
        businessUserEmail,
        '[Tên Đối Tác]',
        null,
        null,
        'checkout',
        bookingId,
        booking.details.checkOutDate,
        userId
      );

      await session.commitTransaction();
      return { success: true, message: 'Check-out thành công. Tiền đã được chuyển vào ví đối tác.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async requestWithdrawalService(userId, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (amount < 50000) {
        throw new Error('Số tiền rút tối thiểu là 50,000 VND.');
      }

      let wallet = await Wallet.findOne({ userId }).session(session);
      if (!wallet) {
        throw new Error('Ví không tồn tại.');
      }
      if (wallet.balance < amount) {
        throw new Error('Số dư không đủ để rút.');
      }

      const otp = generateOTP(6);
      const withdrawalRequest = {
        amount,
        status: 'pending',
        requestedAt: new Date('2025-06-13T16:39:00+07:00'),
        transactionId: `WDR-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      wallet.withdrawalRequests.push(withdrawalRequest);
      wallet.balance -= amount;
      await wallet.save({ session });

      const userEmail = (await BookingRepository.getUserById(userId)).email;
      await sendNotificationEmail(
        userEmail,
        '[Tên Đối Tác]',
        otp,
        10,
        'verify',
        `Yêu cầu rút ${amount} VND cần xác nhận với OTP: ${otp}`
      );

      await session.commitTransaction();
      return { success: true, message: 'Yêu cầu rút tiền đã được gửi. Vui lòng xác nhận OTP.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async confirmWithdrawalService(userId, transactionId, otp) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let wallet = await Wallet.findOne({ userId }).session(session);
      if (!wallet) {
        throw new Error('Ví không tồn tại.');
      }

      const withdrawalRequest = wallet.withdrawalRequests.find(
        (req) => req.transactionId === transactionId && req.status === 'pending'
      );
      if (!withdrawalRequest) {
        throw new Error('Yêu cầu rút tiền không hợp lệ.');
      }

      // TODO: Replace with actual OTP verification logic
      if (otp !== '123456') {
        throw new Error('Mã OTP không đúng.');
      }

      withdrawalRequest.status = 'completed';
      withdrawalRequest.completedAt = new Date('2025-06-13T16:39:00+07:00');

      const withdrawalTransaction = new Transaction({
        userId,
        type: 'withdrawal',
        amount: withdrawalRequest.amount,
        method: 'bank_transfer',
        transactionId: withdrawalRequest.transactionId,
        status: 'completed',
        details: { completedAt: withdrawalRequest.completedAt },
      });
      await withdrawalTransaction.save({ session });

      wallet.transactions.push(withdrawalTransaction._id);
      await wallet.save({ session });

      const userEmail = (await BookingRepository.getUserById(userId)).email;
      await sendNotificationEmail(
        userEmail,
        '[Tên Đối Tác]',
        null,
        null,
        'checkout',
        `Rút ${withdrawalRequest.amount} VND thành công với mã giao dịch ${transactionId}`
      );

      await session.commitTransaction();
      return { success: true, message: 'Rút tiền thành công.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async getWalletDetailsService(userId) {
    const wallet = await Wallet.findOne({ userId }).populate('transactions');
    if (!wallet) {
      throw new Error('Ví không tồn tại.');
    }

    return {
      success: true,
      balance: wallet.balance,
      pendingBalance: wallet.pendingBalance,
      withdrawalRequests: wallet.withdrawalRequests,
      transactions: wallet.transactions,
    };
  },

  async handlePaymentFailureService(bookingId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({ _id: bookingId }).session(session);
      if (!booking || booking.status !== 'pending') {
        throw new Error('Booking không hợp lệ cho việc xử lý thất bại.');
      }

      booking.status = 'cancelled';
      booking.paymentInfo.status = 'failed';
      await booking.save({ session });

      const paymentTransaction = await Transaction.findOne({ bookingId, type: 'payment' }).session(session);
      if (paymentTransaction) {
        paymentTransaction.status = 'failed';
        await paymentTransaction.save({ session });
      }

      const userEmail = (await BookingRepository.getUserById(booking.userId)).email;
      await sendNotificationEmail(
        userEmail,
        '[Tên Khách]',
        null,
        null,
        'checkout',
        `Thanh toán cho Booking ${bookingId} đã thất bại. Vui lòng thử lại.`
      );

      await session.commitTransaction();
      return { success: true, message: 'Xử lý thanh toán thất bại thành công.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async requestRefundService(bookingId, userId, reason) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({ _id: bookingId, userId, status: 'cancelled' }).session(session);
      if (!booking) {
        throw new Error('Booking không hợp lệ để hoàn tiền.');
      }

      const paymentTransaction = await Transaction.findOne({
        bookingId,
        type: 'payment',
        status: 'completed',
      }).session(session);
      if (!paymentTransaction) {
        throw new Error('Không tìm thấy giao dịch thanh toán.');
      }

      const refundAmount = paymentTransaction.amount;
      booking.status = 'refunded';
      booking.paymentInfo.status = 'refunded';
      await booking.save({ session });

      const refundTransaction = new Transaction({
        bookingId,
        userId,
        type: 'refund',
        amount: refundAmount,
        method: paymentTransaction.method,
        transactionId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'completed',
        details: { completedAt: new Date('2025-06-13T16:45:00+07:00') },
      });
      await refundTransaction.save({ session });

      // TODO: Integrate actual PayOS refund API
      // await payos.refundPayment(paymentTransaction.transactionId, refundAmount);

      const userEmail = (await BookingRepository.getUserById(userId)).email;
      await sendNotificationEmail(
        userEmail,
        '[Tên Khách]',
        null,
        null,
        'checkout',
        `Hoàn tiền ${refundAmount} VND cho Booking ${bookingId} đã được xử lý.`
      );

      await session.commitTransaction();
      return { success: true, message: 'Yêu cầu hoàn tiền đã được xử lý.' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
};

module.exports = {
  getBookingsService,
  getBookingByIdService,
  confirmBookingService,
  cancelBookingService,
  getBookingHistoryService,
  bookingService,
};