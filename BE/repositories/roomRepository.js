const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

const addRoom = async (hotelId, ownerId, roomData) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, ownerId },
      { $push: { rooms: roomData } },
      { new: true, runValidators: true }
    );
    if (!hotel) {
      throw new Error('Khách sạn không tồn tại hoặc bạn không có quyền');
    }
    return hotel.rooms[hotel.rooms.length - 1];
  } catch (error) {
    throw new Error(`Lỗi khi thêm phòng: ${error.message}`);
  }
};

const findRoomsByHotelId = async (hotelId, ownerId) => {
  const query = { _id: hotelId };
  if (ownerId) query.ownerId = ownerId;
  const hotel = await Hotel.findOne(query).select('rooms');
  if (!hotel) {
    throw new Error('Khách sạn không tồn tại hoặc bạn không có quyền truy cập');
  }
  return hotel.rooms;
};

const findRoomById = async (hotelId, roomId, ownerId = null) => {
  try {
    const query = { _id: hotelId, 'rooms._id': roomId, status: 'active' }; // Ensure hotel is active
    if (ownerId) query.ownerId = ownerId;
    const hotel = await Hotel.findOne(query).select('rooms');
    if (!hotel) {
      throw new Error('Khách sạn không tồn tại, không hoạt động hoặc bạn không có quyền truy cập');
    }
    const room = hotel.rooms.id(roomId);
    if (!room) {
      throw new Error('Phòng không tồn tại');
    }
    return room;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin phòng: ${error.message}`);
  }
};

const updateRoom = async (hotelId, roomId, ownerId, updates) => {
  try {
    const query = { _id: hotelId, 'rooms._id': roomId };
    if (ownerId) query.ownerId = ownerId;
    const hotel = await Hotel.findOneAndUpdate(
      query,
      { $set: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`rooms.$.${key}`]: updates[key] }), {}) },
      { new: true, runValidators: true }
    );
    if (!hotel) {
      throw new Error('Phòng không tồn tại hoặc bạn không có quyền cập nhật');
    }
    return hotel.rooms.id(roomId);
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật phòng: ${error.message}`);
  }
};

const deleteRoom = async (hotelId, roomId, ownerId) => {
  try {
    const activeBookings = await Booking.countDocuments({
      hotelId,
      'details.roomType': roomId,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (activeBookings > 0) {
      throw new Error('Không thể xóa phòng vì còn đặt phòng đang hoạt động');
    }
    const query = { _id: hotelId };
    if (ownerId) query.ownerId = ownerId;
    const hotel = await Hotel.findOneAndUpdate(
      query,
      { $pull: { rooms: { _id: roomId } } },
      { new: true }
    );
    if (!hotel) {
      throw new Error('Phòng không tồn tại hoặc bạn không có quyền xóa');
    }
    return true;
  } catch (error) {
    throw new Error(`Lỗi khi xóa phòng: ${error.message}`);
  }
};

const updateRoomAvailability = async (hotelId, roomId, ownerId, availability) => {
  try {
    const query = { _id: hotelId, 'rooms._id': roomId };
    if (ownerId) query.ownerId = ownerId;
    const hotel = await Hotel.findOneAndUpdate(
      query,
      { $set: { 'rooms.$.availability': availability } },
      { new: true, runValidators: true }
    );
    if (!hotel) {
      throw new Error('Phòng không tồn tại hoặc bạn không có quyền cập nhật');
    }
    return hotel.rooms.id(roomId);
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật tình trạng phòng: ${error.message}`);
  }
};

const updateRoomPrice = async (hotelId, roomId, ownerId, price) => {
  try {
    const query = { _id: hotelId, 'rooms._id': roomId };
    if (ownerId) query.ownerId = ownerId;
    const hotel = await Hotel.findOneAndUpdate(
      query,
      { $set: { 'rooms.$.price': price } },
      { new: true, runValidators: true }
    );
    if (!hotel) {
      throw new Error('Phòng không tồn tại hoặc bạn không có quyền cập nhật');
    }
    return hotel.rooms.id(roomId);
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật giá phòng: ${error.message}`);
  }
};

module.exports = {
  addRoom,
  findRoomsByHotelId,
  findRoomById,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
  updateRoomPrice
};