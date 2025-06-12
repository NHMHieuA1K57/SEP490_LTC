const HotelRepository = require('../repositories/hotelRepository');
const roomRepository = require('../repositories/roomRepository');
const reviewRepository = require('../repositories/reviewRepository');
const cloudinary = require('../config/cloudinary');

const createHotelService = async (ownerId, data, files) => {
  const {
    name,
    address,
    description,
    location,
    amenities,
    rooms,
    policies,
    category,
    payoutPolicy
  } = data;

  if (!name || !address || !location) {
    throw new Error('Tên, địa chỉ và vị trí khách sạn là bắt buộc');
  }

  let parsedLocation;
  try {
    parsedLocation = JSON.parse(location);
    if (!parsedLocation.coordinates || parsedLocation.coordinates.length !== 2) {
      throw new Error('Tọa độ vị trí không hợp lệ');
    }
  } catch (error) {
    throw new Error('Định dạng vị trí không hợp lệ');
  }

  let images = [];
  if (files && files.length > 0) {
    try {
      images = await Promise.all(
        files.map(file =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'hotels', resource_type: 'image' },
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

  let parsedRooms = [];
  if (rooms) {
    try {
      parsedRooms = JSON.parse(rooms);
      parsedRooms.forEach(room => {
        if (!room.roomType || !room.price || !room.availability) {
          throw new Error('Thông tin phòng không hợp lệ');
        }
      });
    } catch (error) {
      throw new Error('Định dạng phòng không hợp lệ');
    }
  }

  const hotelData = {
    ownerId,
    name,
    address,
    description: description || '',
    location: {
      type: 'Point',
      coordinates: parsedLocation.coordinates
    },
    images,
    amenities: amenities ? amenities.split(',') : [],
    rooms: parsedRooms,
    status: 'active',
    additionalInfo: {
      policies: policies ? JSON.parse(policies) : {},
      category: category || 'hotel',
      payoutPolicy: payoutPolicy || 'monthly'
    }
  };

  const hotel = await HotelRepository.createHotel(hotelData);
  return { success: true, message: 'Tạo khách sạn thành công', data: hotel };
};

const getHotelsService = async (ownerId) => {
  const hotels = await HotelRepository.findHotelsByOwnerId(ownerId);
  return { success: true, message: 'Lấy danh sách khách sạn thành công', data: hotels };
};


const updateHotelService = async (hotelId, ownerId, data, files) => {
  const { name, address, description, location, amenities, rooms, policies, category, payoutPolicy } = data;

  let images = [];
  if (files && files.length > 0) {
    try {
      images = await Promise.all(
        files.map(file =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: 'hotels', resource_type: 'image' },
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
  if (name) updates.name = name;
  if (address) updates.address = address;
  if (description) updates.description = description;
  if (location) {
    try {
      const parsedLocation = JSON.parse(location);
      if (!parsedLocation.coordinates || parsedLocation.coordinates.length !== 2) {
        throw new Error('Tọa độ vị trí không hợp lệ');
      }
      updates.location = { type: 'Point', coordinates: parsedLocation.coordinates };
    } catch (error) {
      throw new Error('Định dạng vị trí không hợp lệ');
    }
  }
  if (amenities) updates.amenities = amenities.split(',');
  if (images.length > 0) updates.images = images;
  if (rooms) {
    try {
      updates.rooms = JSON.parse(rooms);
      updates.rooms.forEach(room => {
        if (!room.roomType || !room.price || !room.availability) {
          throw new Error('Thông tin phòng không hợp lệ');
        }
      });
    } catch (error) {
      throw new Error('Định dạng phòng không hợp lệ');
    }
  }
  if (policies) {
    try {
      updates['additionalInfo.policies'] = JSON.parse(policies);
    } catch (error) {
      throw new Error('Định dạng chính sách không hợp lệ');
    }
  }
  if (category) updates['additionalInfo.category'] = category;
  if (payoutPolicy) updates['additionalInfo.payoutPolicy'] = payoutPolicy;

  const hotel = await HotelRepository.updateHotel(hotelId, ownerId, updates);
  if (!hotel) {
    throw new Error('Khách sạn không tồn tại hoặc bạn không có quyền cập nhật');
  }

  return { success: true, message: 'Cập nhật khách sạn thành công', data: hotel };
};

const deleteHotelService = async (hotelId, ownerId) => {
  const hotel = await HotelRepository.deleteHotel(hotelId, ownerId);
  if (!hotel) {
    throw new Error('Khách sạn không tồn tại hoặc bạn không có quyền xóa');
  }
  return { success: true, message: 'Xóa khách sạn thành công' };
};

const updateHotelStatusService = async (hotelId, ownerId, status) => {
  if (!['active', 'inactive'].includes(status)) {
    throw new Error('Trạng thái không hợp lệ, phải là active hoặc inactive');
  }
  const hotel = await HotelRepository.updateHotelStatus(hotelId, ownerId, status);
  if (!hotel) {
    throw new Error('Khách sạn không tồn tại hoặc bạn không có quyền cập nhật');
  }
  return { success: true, message: `Cập nhật trạng thái khách sạn thành ${status}`, data: hotel };
};

const searchHotels = async (filters, page = 1, limit = 10) => {
  const { location, checkInDate, checkOutDate, numberOfPeople, roomType, minPrice, maxPrice, amenities, category, minRating, maxRating, hasPromotion } = filters;

  // Validate dates
  if (checkInDate && checkOutDate) {
    if (isNaN(Date.parse(checkInDate)) || isNaN(Date.parse(checkOutDate))) {
      throw new Error('Định dạng ngày không hợp lệ');
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      throw new Error('Ngày check-in phải trước ngày check-out');
    }
  }

  // Validate number of people
  if (numberOfPeople && (isNaN(numberOfPeople) || parseInt(numberOfPeople) <= 0)) {
    throw new Error('Số người không hợp lệ');
  }

  // Validate price range
  if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
    throw new Error('Giá phải là số hợp lệ');
  }
  if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
    throw new Error('Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa');
  }

  // Validate rating range
  if ((minRating && isNaN(minRating)) || (maxRating && isNaN(maxRating))) {
    throw new Error('Đánh giá phải là số hợp lệ');
  }
  if (minRating && maxRating && parseFloat(minRating) > parseFloat(maxRating)) {
    throw new Error('Đánh giá tối thiểu phải nhỏ hơn hoặc bằng đánh giá tối đa');
  }
  if ((minRating && (minRating < 0 || minRating > 5)) || (maxRating && (maxRating < 0 || maxRating > 5))) {
    throw new Error('Đánh giá phải nằm trong khoảng 0-5');
  }

  // Validate hasPromotion
  if (hasPromotion && hasPromotion !== 'true' && hasPromotion !== 'false') {
    throw new Error('Trạng thái khuyến mãi phải là true hoặc false');
  }

  const searchFilters = {
    location,
    checkInDate,
    checkOutDate,
    numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined,
    roomType,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    amenities: amenities ? amenities.split(',') : undefined,
    category,
    minRating: minRating ? parseFloat(minRating) : undefined,
    maxRating: maxRating ? parseFloat(maxRating) : undefined,
    hasPromotion
  };

  const result = await HotelRepository.searchHotels(searchFilters, page, limit);

  return {
    success: true,
    message: 'Tìm kiếm khách sạn thành công',
    data: {
      items: result.items,
      pagination: {
        totalItems: result.total,
        totalPages: result.totalPages,
        currentPage: result.page
      }
    }
  };
};

const getHotelDetails = async (hotelId, reviewPage = 1, reviewLimit = 10) => {
  try {
    // Fetch hotel details, including rooms
    const hotel = await HotelRepository.findHotelDetailsById(hotelId);
    
    // Fetch reviews for the hotel with pagination
    const reviews = await reviewRepository.findReviewsByHotelId(hotelId, reviewPage, reviewLimit);
    
    return {
      hotel,
      rooms: hotel.rooms || [], // Rooms are already included in hotel
      reviews
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông tin chi tiết khách sạn: ${error.message}`);
  }
};

module.exports = {
  createHotelService,
  getHotelsService,
  updateHotelService,
  deleteHotelService,
  updateHotelStatusService,
  searchHotels,
  getHotelDetails
};