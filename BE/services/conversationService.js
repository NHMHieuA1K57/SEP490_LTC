const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Booking = require('../models/Booking');
const TourBooking = require('../models/TourBooking');
const Hotel = require('../models/Hotel');
const Tour = require('../models/Tour');

function isParticipant(conv, userId) {
  const id = userId.toString();
  return [conv.customerId.toString(), conv.providerId.toString()].includes(id);
}

exports.listMy = async (userId) => {
  return Conversation.find({
    $or: [{ customerId: userId }, { providerId: userId }],
  }).sort({ lastMessageAt: -1 });
};

exports.getDetailWithMessages = async (convId, userId) => {
  const conv = await Conversation.findById(convId);
  if (!conv) throw Object.assign(new Error('Conversation not found'), { status: 404 });
  if (!isParticipant(conv, userId)) throw Object.assign(new Error('Forbidden'), { status: 403 });
  const messages = await Message.find({ conversationId: conv._id }).sort({ createdAt: 1 });
  return { conv, messages };
};

exports.sendMessage = async (convId, userId, { text, attachments = [] }, io) => {
  const conv = await Conversation.findById(convId);
  if (!conv) throw Object.assign(new Error('Conversation not found'), { status: 404 });
  if (!isParticipant(conv, userId)) throw Object.assign(new Error('Forbidden'), { status: 403 });

  const msg = await Message.create({
    conversationId: conv._id,
    senderId: userId,
    text,
    attachments,
  });

  conv.lastMessageAt = new Date();
  await conv.save();

  // (tuỳ chọn) phát socket cho 2 bên
  if (io) {
    io.to(conv.customerId.toString()).emit('message:new', { conversationId: conv._id, message: msg });
    io.to(conv.providerId.toString()).emit('message:new', { conversationId: conv._id, message: msg });
  }

  return msg;
};

exports.openByBooking = async (requestUserId, { bookingType, bookingId }) => {
  if (!['hotel', 'tour'].includes(bookingType))
    throw Object.assign(new Error('bookingType must be hotel|tour'), { status: 400 });

  let customerId, providerId;

  if (bookingType === 'hotel') {
    const bk = await Booking.findById(bookingId);
    if (!bk) throw Object.assign(new Error('Booking not found'), { status: 404 });
    customerId = bk.userId;
    const hotel = await Hotel.findById(bk.hotelId).select('ownerId');
    if (!hotel) throw Object.assign(new Error('Hotel not found'), { status: 404 });
    providerId = hotel.ownerId;
  } else {
    const tb = await TourBooking.findById(bookingId);
    if (!tb) throw Object.assign(new Error('Tour booking not found'), { status: 404 });
    customerId = tb.customerId;
    const tour = await Tour.findById(tb.tourId).select('ownerId providerId createdBy');
    if (!tour) throw Object.assign(new Error('Tour not found'), { status: 404 });
    providerId = tour.ownerId || tour.providerId || tour.createdBy;
    if (!providerId) throw Object.assign(new Error('Tour missing owner/provider'), { status: 500 });
  }

  // chỉ cho phép người trong cuộc mở
  if (![customerId.toString(), providerId.toString()].includes(requestUserId.toString()))
    throw Object.assign(new Error('Forbidden'), { status: 403 });

  let conv = await Conversation.findOne({ bookingId });
  if (!conv) {
    conv = await Conversation.create({ bookingId, customerId, providerId, lastMessageAt: new Date() });
  }
  return conv;
};
