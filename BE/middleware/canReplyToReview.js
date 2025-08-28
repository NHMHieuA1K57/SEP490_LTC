const { Types } = require('mongoose');
const Review = require('../models/Review');
const Tour   = require('../models/Tour');
const Hotel  = require('../models/Hotel');

const toId = v => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : v);

module.exports = async function canReplyToReview(req, res, next) {
  try {
    const reviewId = toId(req.params.id);
    const rv = await Review.findById(reviewId).select('tourId hotelId');
    if (!rv) return res.status(404).json({ message: 'Review không tồn tại' });

    // admin thì khỏi kiểm
    if (req.user?.role === 'admin') return next();

    if (rv.tourId) {
      const tour = await Tour.findById(rv.tourId).select('providerId');
      if (!tour || String(tour.providerId) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Chỉ tour provider (hoặc admin) mới được reply review của tour này' });
      }
    } else if (rv.hotelId) {
      const hotel = await Hotel.findById(rv.hotelId).select('ownerId');
      if (!hotel || String(hotel.ownerId) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Chỉ hotel owner (hoặc admin) mới được reply review của khách sạn này' });
      }
    } else {
      // Review không trỏ tour/hotel -> không cho reply
      return res.status(400).json({ message: 'Review không gắn với tour/hotel' });
    }

    next();
  } catch (err) {
    next(err);
  }
};
