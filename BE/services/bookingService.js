const bookingRepository = require('../repositories/bookingRepository');
const roomRepository = require('../repositories/roomRepository');
const mongoose = require('mongoose');
const PayOS = require('@payos/node');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
require('dotenv').config();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.API_Key,
  process.env.Checksum_Key
);

const getPendingBookingsService = async (ownerId, filters, page, limit) => {
  try {
    if (page < 1 || limit < 1) {
      throw new Error('Trang và giới hạn phải lớn hơn 0');
    }
    if (filters.hotelId && !mongoose.Types.ObjectId.isValid(filters.hotelId)) {
      throw new Error('ID khách sạn không hợp lệ');
    }
    return await bookingRepository.getPendingBookings(ownerId, filters, page, limit);
  } catch (error) {
    throw new Error(`Lỗi dịch vụ khi lấy danh sách đặt phòng cần xác nhận: ${error.message}`);
  }
};

const getBookingsByOwnerHotelsService = async (ownerId, filters, page, limit) => {
  try {
    if (page < 1 || limit < 1) {
      throw new Error('Trang và giới hạn phải lớn hơn 0');
    }
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'];
    if (filters.status && !validStatuses.includes(filters.status)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    if (filters.hotelId && !mongoose.Types.ObjectId.isValid(filters.hotelId)) {
      throw new Error('ID khách sạn không hợp lệ');
    }
    if (filters.fromDate && isNaN(new Date(filters.fromDate))) {
      throw new Error('Ngày bắt đầu không hợp lệ');
    }
    if (filters.toDate && isNaN(new Date(filters.toDate))) {
      throw new Error('Ngày kết thúc không hợp lệ');
    }
    if (filters.fromDate && filters.toDate && new Date(filters.fromDate) > new Date(filters.toDate)) {
      throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
    }
    return await bookingRepository.getBookingsByOwnerHotels(ownerId, filters, page, limit);
  } catch (error) {
    throw new Error(`Lỗi dịch vụ khi lấy danh sách đặt phòng: ${error.message}`);
  }
};

const getBookingDetailsService = async (bookingId, ownerId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error('ID đặt phòng không hợp lệ');
    }
    return await bookingRepository.getBookingDetails(bookingId, ownerId);
  } catch (error) {
    throw new Error(`Lỗi dịch vụ khi lấy chi tiết đặt phòng: ${error.message}`);
  }
};

const updateBookingStatusService = async (bookingId, ownerId, status) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error('ID đặt phòng không hợp lệ');
    }
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    return await bookingRepository.updateBookingStatus(bookingId, ownerId, status);
  } catch (error) {
    throw new Error(`Lỗi dịch vụ khi cập nhật trạng thái đặt phòng: ${error.message}`);
  }
};

const createBookingService = async (userId, bookingData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfPeople,
      promotionCode,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      specialRequests = ''
    } = bookingData;

    if (!mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(hotelId) ||
      !mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error('ID người dùng, khách sạn hoặc phòng không hợp lệ');
    }

    if (!buyerName || !buyerEmail || numberOfPeople <= 0) {
      throw new Error('Thông tin người mua và số người là bắt buộc');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (isNaN(checkIn) || isNaN(checkOut) || checkIn >= checkOut) {
      throw new Error('Ngày check-in/check-out không hợp lệ');
    }

    const room = await roomRepository.findAvailableRoom(
      roomId,
      checkInDate,
      checkOutDate,
      numberOfPeople,
      session
    );
    if (!room) throw new Error('Phòng không khả dụng hoặc không tồn tại');

    const hotel = await Hotel.findOne({ _id: hotelId, status: 'active' }).session(session);
    if (!hotel) throw new Error('Khách sạn không tồn tại hoặc không hoạt động');

    let totalPrice = room.price * numberOfPeople;
    let discount = 0;

    if (promotionCode) {
      // const promotion = await Promotion.findOne({
      //   code: promotionCode,
      //   type: 'hotel',
      //   hotelId,
      //   startDate: { $lte: new Date() },
      //   endDate: { $gte: new Date() },
      //   usedCount: { $lt: '$maxUses' }
      // }).session(session);

      // if (!promotion) throw new Error('Mã khuyến mãi không hợp lệ hoặc đã hết hạn');

      // discount = promotion.discountAmount || (totalPrice * (promotion.discountPercentage / 100));
        const discount = await bookingRepository.applyPromotion(promotionCode, hotelId, session);
      discountAmount = discount || 0;
      totalPrice = Math.max(0, totalPrice - discount);

      promotion.usedCount += 1;
      await promotion.save({ session });
    }

    const owner = await User.findById(hotel.ownerId).session(session);
    if (!owner) throw new Error('Chủ khách sạn không tồn tại');

    const commissionRate = owner.businessInfo?.commissionRate || 0.1;
    const commissionAmount = totalPrice * commissionRate;
    const netPayoutAmount = totalPrice - commissionAmount;

    const bookingCode = `BOOK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const bookingPayload = {
      userId,
      type: 'hotel',
      hotelId,
      roomId,
      details: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfPeople,
        roomType: room.roomType,
        specialRequests
      },
      totalPrice,
      commissionAmount,
      netPayoutAmount,
      status: 'pending',
      paymentInfo: {
        bookingCode,
        paymentMethod: 'payos',
        payoutStatus: 'pending'
      }
    };

    console.log('📝 Booking payload:', bookingPayload);

    const createdBookings = await bookingRepository.createBooking(bookingPayload, session);
    if (!Array.isArray(createdBookings) || createdBookings.length === 0) {
      throw new Error('Tạo booking thất bại');
    }
    const createdBooking = createdBookings[0];

    await bookingRepository.createPayment(
      {
        amount: totalPrice,
        bookingId: createdBooking._id,
        status: 'pending'
      },
      session
    );

    await bookingRepository.updateRoomAvailability(roomId, checkInDate, checkOutDate, numberOfPeople, session);

    if (!room.roomType || typeof room.price !== 'number') {
      throw new Error('Dữ liệu phòng thiếu roomType hoặc price');
    }
    const rawDescription = `Phòng ${room.roomType} tại ${hotel.name}`;
    const description = rawDescription.length > 25 ? rawDescription.slice(0, 25) : rawDescription;
    const paymentData = {
      orderCode: parseInt(bookingCode.replace('BOOK', '')),
      amount: totalPrice,
      description,
      items: [
        {
          name: room.roomType,
          quantity: numberOfPeople,
          price: room.price
        }
      ],
      cancelUrl: process.env.CANCEL_URL || 'https://localhost:3000/cancel',
      returnUrl: process.env.RETURN_URL || 'https://localhost:3000/success',
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60
    };

    // console.log('📦 Gửi PayOS:', paymentData);

    if (!room?.roomType || typeof room.price !== 'number' || typeof numberOfPeople !== 'number') {
      throw new Error('❌ Dữ liệu phòng không hợp lệ: thiếu roomType, price hoặc numberOfPeople');
    }
    console.log('📦 Dữ liệu gửi PayOS:', {
      roomType: room.roomType,
      roomPrice: room.price,
      numberOfPeople,
    });

    const paymentLinkData = await payOS.createPaymentLink(paymentData);

    createdBooking.paymentLink = paymentLinkData.checkoutUrl;
    await createdBooking.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      message: 'Tạo booking thành công',
      data: {
        bookingId: createdBooking._id.toString(),
        paymentLink: paymentLinkData.checkoutUrl,
        expiresAt: paymentData.expiredAt
      }
    };
  } catch (err) {
    await session.abortTransaction();
    console.error('❌ Lỗi trong createBookingService:', err);
    throw new Error(`Lỗi dịch vụ khi tạo booking: ${err.message}`);
  } finally {
    session.endSession();
  }
};
const processPaymentService = async (userId, bookingId, action) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error('ID đặt phòng không hợp lệ');
    }

    const booking = await bookingRepository.getBookingById(bookingId, session);
    if (!booking || booking.userId.toString() !== userId) {
      throw new Error('Đặt phòng không tồn tại hoặc không thuộc về người dùng');
    }

    if (action === 'confirm') {
      const paymentStatus = await payOS.checkPaymentStatus({
        orderCode: parseInt(booking.paymentInfo.bookingCode.replace('BOOK', ''))
      });

      if (paymentStatus.data.status === 'PAID') {
        booking.status = 'confirmed';
        booking.paymentInfo.payoutStatus = 'completed';

        const payment = await bookingRepository.getPaymentByBookingId(bookingId, session);
        payment.status = 'completed';
        await payment.save({ session });
        await booking.save({ session });

      } else if (paymentStatus.data.status === 'CANCELLED' || paymentStatus.data.status === 'EXPIRED') {
        booking.status = 'cancelled';
        booking.paymentInfo.payoutStatus = 'failed';

        // Trả lại phòng khi hủy booking do hết hạn hoặc hủy thanh toán
        await bookingRepository.releaseRoomAvailability(
          booking.roomId,
          booking.details.checkInDate,
          booking.details.checkOutDate,
          booking.details.numberOfPeople,
          session
        );

        await booking.save({ session });

        throw new Error('Thanh toán đã bị hủy hoặc hết hạn');
      } else {
        throw new Error('Thanh toán đang xử lý hoặc thất bại');
      }

      await session.commitTransaction();

      return {
        success: true,
        message: 'Xác nhận thanh toán thành công',
        data: { status: booking.status }
      };

    } else if (action === 'retry') {
      const room = await roomRepository.findAvailableRoom(
        booking.roomId,
        booking.details.checkInDate,
        booking.details.checkOutDate,
        booking.details.numberOfPeople,
        session
      );
      if (!room) {
        throw new Error('Phòng không còn khả dụng để thử lại thanh toán');
      }

      // Lấy tên khách sạn đúng cách
      const hotel = await Hotel.findById(booking.hotelId).select('name').session(session);
      const hotelName = hotel?.name || '';

      const paymentData = {
        orderCode: parseInt(booking.paymentInfo.bookingCode.replace('BOOK', '')) + 1,
        amount: booking.totalPrice,
        description: `Thanh toán lại đặt phòng ${booking.details.roomType} tại ${hotelName}`,
        items: [{
          name: booking.details.roomType,
          quantity: booking.details.numberOfPeople,
          price: booking.totalPrice / booking.details.numberOfPeople
        }],
        cancelUrl: process.env.CANCEL_URL ,
        returnUrl: process.env.RETURN_URL ,
        buyerName: booking.buyerName ,
        buyerEmail: booking.buyerEmail ,
        buyerPhone: booking.buyerPhone ,
        buyerAddress: booking.buyerAddress ,
        expiredAt: Math.floor(Date.now() / 1000) + 15 * 60
      };

      const paymentLinkData = await payOS.createPaymentLink(paymentData);

      booking.paymentLink = paymentLinkData.checkoutUrl;
      await booking.save({ session });

      await session.commitTransaction();

      return {
        success: true,
        message: 'Tạo lại link thanh toán thành công',
        data: {
          paymentLink: paymentLinkData.checkoutUrl,
          expiresAt: paymentData.expiredAt
        }
      };

    } else {
      throw new Error('Hành động không hợp lệ, chỉ chấp nhận "confirm" hoặc "retry"');
    }
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`Lỗi dịch vụ khi xử lý thanh toán: ${error.message}`);
  } finally {
    session.endSession();
  }
};

module.exports = {
  getPendingBookingsService,
  getBookingsByOwnerHotelsService,
  getBookingDetailsService,
  updateBookingStatusService,
  createBookingService
};