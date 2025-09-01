const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const tourRepo = require('../repositories/tourBookingRepository');
const transactionRepo = require('../repositories/transactionRepository');

/* helpers */
function ensurePayment(payment) {
  if (!payment || !['paypal', 'momo', 'vnpay', 'cash'].includes(payment.method)) {
    throw new Error('Phương thức thanh toán không hợp lệ');
  }
}
function calcTotalPrice(tour, qtyAdult, qtyChild) {
  const adultPrice = tour.priceAdult ?? tour.price;
  const childPrice = tour.priceChild ?? tour.price;
  return qtyAdult * adultPrice + qtyChild * childPrice;
}

/* APIs */
exports.bookTour = async (user, body) => {
  const {
    tourId,
    availabilityId,
    quantityAdult = 1,
    quantityChild = 0,
    isPrivateBooking = false,
    note,
    payment = { method: 'paypal' }
  } = body;

  ensurePayment(payment);
  if (quantityAdult < 0 || quantityChild < 0) throw new Error('Số lượng không hợp lệ');

  const totalPeople = quantityAdult + quantityChild;
  if (!isPrivateBooking && totalPeople <= 0) throw new Error('Cần ít nhất 1 khách để đặt chỗ');

  const session = await mongoose.startSession();
  try {
    let booking;
    await session.withTransaction(async () => {
      const tour = await Tour.findById(tourId)
        .select('status name providerId allowPrivateBooking price priceAdult priceChild availability')
        .session(session);
      if (!tour || tour.status !== 'active') throw new Error('Tour không tồn tại hoặc không hoạt động');

      const avl = tour.availability.id(availabilityId);
      if (!avl) throw new Error('Không tìm thấy ngày khởi hành');

      const now = new Date();
      if (avl.date && avl.date < now) throw new Error('Ngày khởi hành đã qua');
      if (avl.status === 'cancelled') throw new Error('Lịch khởi hành đã bị hủy');
      if (avl.isPrivate) throw new Error('Ngày khởi hành đã được đặt riêng');

      if (isPrivateBooking) {
        if (!tour.allowPrivateBooking) throw new Error('Tour không cho phép đặt riêng');

        const updated = await Tour.findOneAndUpdate(
          {
            _id: tourId,
            status: 'active',
            'availability._id': availabilityId,
            'availability.$[a].status': 'available',
            'availability.$[a].isPrivate': false
          },
          {
            $set: {
              'availability.$[a].isPrivate': true,
              'availability.$[a].status': 'full'
            }
          },
          {
            new: true,
            arrayFilters: [{ 'a._id': new mongoose.Types.ObjectId(availabilityId) }],
            session
          }
        );
        if (!updated) throw new Error('Không thể khóa lịch khởi hành để đặt riêng');
      } else {
        if (avl.status !== 'available') throw new Error('Lịch khởi hành không khả dụng');

        const updated = await Tour.findOneAndUpdate(
          {
            _id: tourId,
            status: 'active',
            'availability._id': availabilityId,
            'availability.$[a].status': 'available',
            'availability.$[a].isPrivate': false,
            'availability.$[a].slots': { $gte: totalPeople }
          },
          { $inc: { 'availability.$[a].slots': -totalPeople } },
          {
            new: true,
            arrayFilters: [{ 'a._id': new mongoose.Types.ObjectId(availabilityId) }],
            session
          }
        );
        if (!updated) throw new Error('Chỉ còn ít chỗ, không đủ để đặt');

        const after = updated.availability.id(availabilityId);
        if (after && after.slots === 0 && after.status !== 'full') {
          await Tour.updateOne(
            { _id: tourId, 'availability._id': availabilityId },
            { $set: { 'availability.$[a].status': 'full' } },
            { arrayFilters: [{ 'a._id': new mongoose.Types.ObjectId(availabilityId) }], session }
          );
        }
      }

      const totalPrice = calcTotalPrice(tour, quantityAdult, quantityChild);

      booking = await tourRepo.create(
        {
          tourId,
          customerId: user._id,
          availabilityId,
          quantityAdult,
          quantityChild,
          totalPrice,
          isPrivateBooking,
          payment,
          status: 'pending',
          note,
          // snapshot meta cho UI
          meta: {
            tourName: tour.name,
            startDate: avl.date,
            endDate: avl.endDate || null,
            meetLocation: avl.meetLocation || null,
            time: avl.time || null,
            timeSlot: avl.timeSlot || null,
            unitPriceAdult: tour.priceAdult ?? tour.price,
            unitPriceChild: tour.priceChild ?? tour.price
          }
        },
        { session }
      );
    });

    return booking;
  } finally {
    session.endSession();
  }
};

exports.refundBooking = async (bookingId, userId) => {
  const booking = await tourRepo.findById(bookingId);
  if (!booking) throw new Error('Không tìm thấy booking');
  if (booking.customerId.toString() !== userId.toString()) {
    throw new Error('Bạn không có quyền hoàn đơn này');
  }
  if (!['confirmed', 'completed'].includes(booking.status)) {
    throw new Error('Chỉ hoàn tiền đơn đã xác nhận hoặc hoàn thành');
  }

  const tour = await Tour.findById(booking.tourId).select('providerId availability');
  if (!tour) throw new Error('Không tìm thấy tour tương ứng');

  // Trả slot / gỡ private nếu còn trước ngày khởi hành
  const avl = tour.availability.id(booking.availabilityId);
  if (avl) {
    const now = new Date();
    const totalPeople = (booking.quantityAdult || 0) + (booking.quantityChild || 0);
    if (avl.date && avl.date > now) {
      if (!booking.isPrivateBooking) {
        await Tour.updateOne(
          { _id: tour._id, 'availability._id': booking.availabilityId },
          {
            $inc: { 'availability.$[a].slots': totalPeople },
            $set: { 'availability.$[a].status': 'available' }
          },
          { arrayFilters: [{ 'a._id': new mongoose.Types.ObjectId(booking.availabilityId) }] }
        );
      } else {
        await Tour.updateOne(
          { _id: tour._id, 'availability._id': booking.availabilityId },
          {
            $set: {
              'availability.$[a].isPrivate': false,
              'availability.$[a].status': 'available'
            }
          },
          { arrayFilters: [{ 'a._id': new mongoose.Types.ObjectId(booking.availabilityId) }] }
        );
      }
    }
  }

  // Cập nhật booking -> refunded + payment.refunded
  await tourRepo.updateStatus(bookingId, 'refunded');
  await tourRepo.updatePaymentStatus(bookingId, 'refunded');

  // Ghi transaction hoàn tiền
  const transaction = await transactionRepo.create({
    userId,
    type: 'refund',
    direction: 'out',
    amount: booking.totalPrice,
    method: booking.payment.method,
    status: 'pending',
    transactionId: `REF_${Date.now()}`,
    tourBookingId: booking._id,
    details: {
      businessUserId: tour.providerId,
      commission: 0,
      completedAt: null
    }
  });

  return transaction;
};

exports.searchBookings = async ({ filter, options }) => {
  return await tourRepo.search(filter, options);
};

exports.getMyBookings = async (userId, options = {}) => {
  return await tourRepo.findByCustomer(userId, options);
};
