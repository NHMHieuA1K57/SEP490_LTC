// repositories/reviewRepository.js
const { Types } = require('mongoose');
const Review = require('../models/Review');

const toId = (v) => {
  if (v == null) return v;
  const s = typeof v === 'string' ? v.trim() : v; // <-- TRIM khoảng trắng/ký tự ẩn
  if (Types.ObjectId.isValid(s)) return new Types.ObjectId(s);
  throw new Error(`Invalid ObjectId: ${s}`);
};
module.exports = {
  // Ép ObjectId tại repo
  async create(data, session) {
    const payload = {
      ...data,
      userId: toId(data.userId),
      bookingId: toId(data.bookingId),
      tourId: data.tourId ? toId(data.tourId) : undefined,
      hotelId: data.hotelId ? toId(data.hotelId) : undefined,
    };

   console.log('[REPO] create review payload', {
  userId: String(payload.userId),
  bookingId: String(payload.bookingId),
  tourId: payload.tourId && String(payload.tourId),
  hotelId: payload.hotelId && String(payload.hotelId),
});

    const docs = await Review.create([payload], { session });
    return docs[0];
  },

  findById(id) { return Review.findById(id); },

  findByUserTarget({ userId, hotelId, tourId }) {
    return Review.findOne({
      userId: toId(userId),
      hotelId: hotelId ? toId(hotelId) : undefined,
      tourId: tourId ? toId(tourId) : undefined
    });
  },

  listByTarget({ filter, sort, page, limit }) {
    const f = { ...filter };
    if (f.hotelId) f.hotelId = toId(f.hotelId);
    if (f.tourId)  f.tourId  = toId(f.tourId);
    return Review.find(f).sort(sort).skip((page - 1) * limit).limit(limit);
  },

  countByTarget(filter) {
    const f = { ...filter };
    if (f.hotelId) f.hotelId = toId(f.hotelId);
    if (f.tourId)  f.tourId  = toId(f.tourId);
    return Review.countDocuments(f);
  },

  addReply(id, reply) {
    return Review.findByIdAndUpdate(toId(id), { $push: { replies: reply } }, { new: true });
  },

  incHelpful(id, value) {
    return Review.findByIdAndUpdate(toId(id), { $inc: { helpfulCount: value } }, { new: true });
  },

  updateStatus(id, status) {
    return Review.findByIdAndUpdate(toId(id), { status }, { new: true });
  },

  delete(id) { return Review.findByIdAndDelete(toId(id)); },

  async exists(filter) {
    const f = { ...filter };
    if (f.userId)    f.userId    = toId(f.userId);
    if (f.bookingId) f.bookingId = toId(f.bookingId);
    if (f.hotelId)   f.hotelId   = toId(f.hotelId);
    if (f.tourId)    f.tourId    = toId(f.tourId);
    return !!(await Review.exists(f));
  }
};
