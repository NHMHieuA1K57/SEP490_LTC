// services/reviewService.js
const { Types } = require('mongoose');

const reviewRepo = require('../repositories/reviewRepository');
const helpfulVoteRepo = require('../repositories/helpfulVoteRepository');
const ReviewReport = require('../models/ReviewReport');

const Booking = require('../models/Booking');          // Hotel booking
const TourBooking = require('../models/TourBooking');  // Tour booking

// helper ép ObjectId an toàn
const toId = (v) => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : v);

function isNonEmptyStr(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

async function createReview({
  userId, hotelId, tourId, bookingId,
  rating, comment, images, criteria
}) {
  // 1) Validate cơ bản
  if (typeof rating !== 'number') rating = Number(rating);
  if (!rating || rating < 1 || rating > 5) throw new Error('Rating không hợp lệ');
  if (!bookingId) throw new Error('Thiếu bookingId');
  if (!!hotelId === !!tourId) throw new Error('Phải review cho hotel HOẶC tour');

  const _userId = toId(userId);
  const _bookingId = toId(bookingId);
  const _hotelId = hotelId ? toId(hotelId) : undefined;
  const _tourId  = tourId  ? toId(tourId)  : undefined;

  // 2) Chặn trùng (1 booking chỉ review 1 lần bởi cùng user)
  const existed = await reviewRepo.exists({ bookingId: _bookingId, userId: _userId });
  if (existed) throw new Error('Bạn đã review booking này rồi');

  // 3) Lấy booking & kiểm điều kiện
  let booking = null;
  if (_tourId) {
    // ---- TOUR ----
    // Tìm theo _id + tourId + customerId (tất cả ép ObjectId)
    booking = await TourBooking.findOne({
      _id: _bookingId,
      tourId: _tourId,
      customerId: _userId
    }).lean();

    if (!booking) {
      console.warn('Review DEBUG (tour) booking null with', {
        _bookingId, _tourId, _userId
      });
      throw new Error('Booking không hợp lệ');
    }

    const status = booking.status;
    const pay = booking.payment || {};
    const paidStatusOK = pay.status === 'completed';
    // chấp nhận transactionId ở payment hoặc (fallback) ở root
    const hasTxn = isNonEmptyStr(pay.transactionId) || isNonEmptyStr(booking.transactionId);

    // Quy tắc: cho review nếu (đã completed) OR (đã paid hợp lệ: completed + có transactionId)
    const canReview = status === 'completed' || (paidStatusOK && hasTxn);

    if (!canReview) {
      throw new Error('Bạn chỉ được review khi đã thanh toán/xác nhận hợp lệ');
    }

    // copy transactionId root về payment để chuẩn hoá dữ liệu:
    if (paidStatusOK && !isNonEmptyStr(pay.transactionId) && isNonEmptyStr(booking.transactionId)) {
      await TourBooking.updateOne(
        { _id: booking._id },
        { $set: { 'payment.transactionId': booking.transactionId } }
      );
    }

  } else if (_hotelId) {
    // ---- HOTEL ----
    booking = await Booking.findOne({
      _id: _bookingId,
      hotelId: _hotelId,
      userId: _userId,
      status: { $in: ['confirmed', 'completed'] }
    }).lean();

    if (!booking) throw new Error('Booking không hợp lệ');
  }

  // 4) Chuẩn hoá input review
  const doc = {
    userId: _userId,
    hotelId: _hotelId,
    tourId: _tourId,
    bookingId: _bookingId,
    rating,
    comment: isNonEmptyStr(comment) ? comment.trim() : undefined,
    images: Array.isArray(images) ? images.filter(isNonEmptyStr) : undefined,
    criteria: Array.isArray(criteria) ? criteria : undefined
  };

  // 5) Tạo review
  const review = await reviewRepo.create(doc);

  // 6) Đánh dấu booking đã review (nếu schema có field này thì sẽ set, không có thì Mongo bỏ qua)
  if (_tourId) {
    await TourBooking.updateOne({ _id: _bookingId }, { $set: { reviewed: true } });
    // TODO (tuỳ dự án): cập nhật điểm trung bình của Tour (aggregate)
    // await tourRepo.recalculateRating(_tourId);
  } else {
    await Booking.updateOne({ _id: _bookingId }, { $set: { reviewed: true } });
  }

  return review;
}

async function listReviews({ hotelId, tourId, page = 1, limit = 10, withPhotos = false, sort = 'newest' }) {
  const filter = { status: 'published' };
  if (hotelId) filter.hotelId = toId(hotelId);
  if (tourId)  filter.tourId  = toId(tourId);
  if (withPhotos) filter['images.0'] = { $exists: true };

  const sortMap = {
    newest:  { createdAt: -1 },
    helpful: { helpfulCount: -1, createdAt: -1 }
  };

  const items = await reviewRepo.listByTarget({
    filter, sort: sortMap[sort] || sortMap.newest, page, limit
  });
  const total = await reviewRepo.countByTarget(filter);
  return { items, total, page, limit };
}

async function voteHelpful({ reviewId, userId, on }) {
  const _reviewId = toId(reviewId);
  const _userId = toId(userId);

  if (on) {
    try {
      await helpfulVoteRepo.createUnique({ reviewId: _reviewId, userId: _userId });
      return reviewRepo.incHelpful(_reviewId, 1);
    } catch (err) {
      if (err.code === 11000) return; // đã vote rồi
      throw err;
    }
  } else {
    const removed = await helpfulVoteRepo.delete({ reviewId: _reviewId, userId: _userId });
    if (removed) return reviewRepo.incHelpful(_reviewId, -1);
  }
}

async function replyReview({ reviewId, userId, content }) {
  if (!isNonEmptyStr(content)) throw new Error('Nội dung phản hồi trống');
  return reviewRepo.addReply(toId(reviewId), { userId: toId(userId), content: content.trim() });
}

async function changeStatus({ reviewId, status }) {
  return reviewRepo.updateStatus(toId(reviewId), status);
}

async function deleteReview(id) {
  return reviewRepo.delete(toId(id));
}

// ----------------------- reportReview -----------------------
async function reportReview({ reviewId, reporterId, reason, note }) {
  const _reviewId   = toId(reviewId);
  const _reporterId = toId(reporterId);

  const r = await Review.findById(_reviewId).select('userId');
  if (!r) throw new Error('Review không tồn tại');

  if (String(r.userId) === String(_reporterId)) {
    throw new Error('Không thể report review của chính mình');
  }

  return ReviewReport.create({
    reviewId: _reviewId,
    reporterId: _reporterId,
    reason,
    note
  });
}

async function listReports() {
  return ReviewReport.find().populate('reviewId').sort({ createdAt: -1 });
}

async function handleReport({ reportId, status }) {
  return ReviewReport.findByIdAndUpdate(toId(reportId), { status }, { new: true });
}

module.exports = {
  createReview,
  listReviews,
  voteHelpful,
  replyReview,
  changeStatus,
  deleteReview,
  reportReview,
  listReports,
  handleReport
};
