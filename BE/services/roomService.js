const RoomRepository = require('../repositories/roomRepository');
const cloudinary = require('../config/cloudinary');

const createRoomService = async (hotelId, ownerId, data, files) => {
  const { roomType, price, availability, description, amenities } = data;

  if (!roomType || !price || !availability) {
    throw new Error('Loại phòng, giá và tình trạng phòng là bắt buộc');
  }

  let parsedAvailability;
  try {
    parsedAvailability = JSON.parse(availability);
    parsedAvailability.forEach(item => {
      if (!item.date || item.quantity === undefined) {
        throw new Error('Thông tin tình trạng phòng không hợp lệ');
      }
    });
  } catch (error) {
    throw new Error('Định dạng tình trạng phòng không hợp lệ');
  }

  let images = [];
  if (files && files.length > 0) {
    try {
      images = await Promise.all(
        files.map(file =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'hotel_rooms', resource_type: 'image' },
              (error, result) => {
                if (error) reject(new Error('Lỗi khi tải lên hình ảnh'));
                resolve(result.secure_url);
              }
            ).end(file.buffer);
          })
        )
      );
    } catch (error) {
      throw new Error(`Lỗi khi tải lên hình ảnh: ${error.message}`);
    }
  }

  const roomData = {
    roomType,
    price: parseFloat(price),
    availability: parsedAvailability,
    description: description || '',
    amenities: amenities ? amenities.split(',') : [],
    images
  };

  const room = await RoomRepository.addRoom(hotelId, ownerId, roomData);
  return { success: true, message: 'Thêm phòng thành công', data: room };
};

const getRoomsService = async (hotelId, ownerId) => {
  const rooms = await RoomRepository.findRoomsByHotelId(hotelId, ownerId);
  return { success: true, message: 'Lấy danh sách phòng thành công', data: rooms };
};

const updateRoomService = async (hotelId, roomId, ownerId, data, files) => {
  const { roomType, price, availability, description, amenities } = data;

  let images = [];
  if (files && files.length > 0) {
    try {
      images = await Promise.all(
        files.map(file =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'hotel_rooms', resource_type: 'image' },
              (error, result) => {
                if (error) reject(new Error('Lỗi khi tải lên hình ảnh'));
                resolve(result.secure_url);
              }
            ).end(file.buffer);
          })
        )
      );
    } catch (error) {
      throw new Error(`Lỗi khi tải lên hình ảnh: ${error.message}`);
    }
  }

  const updates = {};
  if (roomType) updates.roomType = roomType;
  if (price) updates.price = parseFloat(price);
  if (availability) {
    try {
      const parsedAvailability = JSON.parse(availability);
      parsedAvailability.forEach(item => {
        if (!item.date || item.quantity === undefined) {
          throw new Error('Thông tin tình trạng phòng không hợp lệ');
        }
      });
      updates.availability = parsedAvailability;
    } catch (error) {
      throw new Error('Định dạng tình trạng phòng không hợp lệ');
    }
  }
  if (description) updates.description = description;
  if (amenities) updates.amenities = amenities.split(',');
  if (images.length > 0) updates.images = images;

  const room = await RoomRepository.updateRoom(hotelId, roomId, ownerId, updates);
  return { success: true, message: 'Cập nhật phòng thành công', data: room };
};

const deleteRoomService = async (hotelId, roomId, ownerId) => {
  await RoomRepository.deleteRoom(hotelId, roomId, ownerId);
  return { success: true, message: 'Xóa phòng thành công' };
};

const updateRoomAvailabilityService = async (hotelId, roomId, ownerId, availability) => {
  let parsedAvailability;
  try {
    parsedAvailability = JSON.parse(availability);
    parsedAvailability.forEach(item => {
      if (!item.date || item.quantity === undefined) {
        throw new Error('Thông tin tình trạng phòng không hợp lệ');
      }
    });
  } catch (error) {
    throw new Error('Định dạng tình trạng phòng không hợp lệ');
  }

  const room = await RoomRepository.updateRoomAvailability(hotelId, roomId, ownerId, parsedAvailability);
  return { success: true, message: 'Cập nhật tình trạng phòng thành công', data: room };
};

const updateRoomPriceService = async (hotelId, roomId, ownerId, price) => {
  if (!price || isNaN(price) || price <= 0) {
    throw new Error('Giá phòng không hợp lệ');
  }
  const room = await RoomRepository.updateRoomPrice(hotelId, roomId, ownerId, parseFloat(price));
  return { success: true, message: 'Cập nhật giá phòng thành công', data: room };
};
const getRoomDetails = async (hotelId, roomId) => {
  try {
    // Fetch room details
    const room = await RoomRepository.findRoomById(hotelId, roomId);
    return room;
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin chi tiết phòng: ${error.message}`);
  }
};


module.exports = {
  createRoomService,
  getRoomsService,
  updateRoomService,
  deleteRoomService,
  updateRoomAvailabilityService,
  updateRoomPriceService,
  getRoomDetails
};