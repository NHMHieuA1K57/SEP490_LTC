const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

const createHotel = async (hotelData) => {
  try {
    const hotel = new Hotel(hotelData);
    return await hotel.save();
  } catch (error) {
    throw new Error(`Lỗi khi tạo khách sạn: ${error.message}`);
  }
};

const findHotelsByOwnerId = async (ownerId) => {
  return await Hotel.find({ ownerId })
    .select('name address description images amenities status createdAt updatedAt additionalInfo rating')
    .lean();
};

const findHotelById = async (hotelId, ownerId) => {
  return await Hotel.findOne({ _id: hotelId, ownerId })
    .select('name address description images amenities status createdAt updatedAt additionalInfo rating rooms location');
};

const findHotelDetailsById = async (hotelId) => {
  try {
    const hotel = await Hotel.findOne({ _id: hotelId, status: 'active' })
      .select('name address description images amenities rating status createdAt updatedAt additionalInfo rooms location')
      .lean();
    if (!hotel) {
      throw new Error('Khách sạn không tồn tại hoặc không hoạt động');
    }
    return hotel;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin chi tiết khách sạn: ${error.message}`);
  }
};

const updateHotel = async (hotelId, ownerId, updates) => {
  try {
    return await Hotel.findOneAndUpdate(
      { _id: hotelId, ownerId },
      { $set: { ...updates, updatedAt: new Date() } },
      { new: true, runValidators: true }
    ).select('name address description images amenities status createdAt updatedAt additionalInfo rating rooms location');
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật khách sạn: ${error.message}`);
  }
};

const deleteHotel = async (hotelId, ownerId) => {
  try {
    const activeBookings = await Booking.countDocuments({
      hotelId,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (activeBookings > 0) {
      throw new Error('Không thể xóa khách sạn vì còn đặt phòng đang hoạt động');
    }
    return await Hotel.findOneAndDelete({ _id: hotelId, ownerId });
  } catch (error) {
    throw new Error(`Lỗi khi xóa khách sạn: ${error.message}`);
  }
};

const updateHotelStatus = async (hotelId, ownerId, status) => {
  try {
    return await Hotel.findOneAndUpdate(
      { _id: hotelId, ownerId },
      { $set: { status, updatedAt: new Date() } },
      { new: true, runValidators: true }
    ).select('name status updatedAt');
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật trạng thái khách sạn: ${error.message}`);
  }
};

const searchHotels = async (filters, page = 1, limit = 10) => {
  const {
    location,
    checkInDate,
    checkOutDate,
    numberOfPeople,
    roomType,
    minPrice,
    maxPrice,
    amenities,
    category,
    minRating,
    maxRating,
    hasPromotion
  } = filters;

  const query = { status: 'active' };

  if (location) {
    query.address = { $regex: location, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query['rooms.price'] = {};
    if (minPrice) query['rooms.price'].$gte = parseFloat(minPrice);
    if (maxPrice) query['rooms.price'].$lte = parseFloat(maxPrice);
  }

  if (roomType) {
    query['rooms.roomType'] = roomType;
  }

  if (amenities && amenities.length) {
    query.amenities = { $all: amenities };
  }

  if (category) {
    const categories = category.split(',');
    query['additionalInfo.category'] = { $in: categories };
  }

  if (minRating || maxRating) {
    query.rating = {};
    if (minRating) query.rating.$gte = parseFloat(minRating);
    if (maxRating) query.rating.$lte = parseFloat(maxRating);
  }

  if (checkInDate && checkOutDate && numberOfPeople) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    query['rooms.availability'] = {
      $elemMatch: {
        date: { $gte: checkIn, $lte: checkOut },
        quantity: { $gte: parseInt(numberOfPeople) }
      }
    };
  }

  const skip = (page - 1) * limit;
  const [hotels, total] = await Promise.all([
    Hotel.find(query)
      .select('name address description images amenities rooms location rating additionalInfo')
      .skip(skip)
      .limit(limit)
      .lean(),
    Hotel.countDocuments(query)
  ]);

  return {
    items: hotels,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

module.exports = {
  createHotel,
  findHotelsByOwnerId,
  findHotelById,
  findHotelDetailsById,
  updateHotel,
  deleteHotel,
  updateHotelStatus,
  searchHotels
};