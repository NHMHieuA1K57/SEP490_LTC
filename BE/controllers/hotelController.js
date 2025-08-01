const hotelService = require('../services/hotelService');

const createHotel = async (req, res) => {
  try {
    const response = await hotelService.createHotelService(req.user._id, req.body, req.files);
    return res.status(201).json(response);
  } catch (error) {
    console.error('Lỗi khi tạo khách sạn:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const response = await hotelService.getHotelsService(req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách sạn:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getHotel = async (req, res) => {
  try {
    const response = await hotelService.getHotelService(req.params.id, req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết khách sạn:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getHotelDetails = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, numberOfPeople } = req.query;
    const filters = {
      checkInDate,
      checkOutDate,
      numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined
    };
    const response = await hotelService.getHotelDetailsService(req.params.hotelId, filters);
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết khách sạn:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateHotel = async (req, res) => {
  try {
    const response = await hotelService.updateHotelService(req.params.id, req.user._id, req.body, req.files);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật khách sạn:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const response = await hotelService.deleteHotelService(req.params.id, req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi khi xóa khách sạn:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const searchHotelsController = async (req, res) => {
  try {
    const filters = req.query;
    const result = await hotelService.searchHotelsService(filters);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);

    const isUserInputError = error.message.includes('từ khóa tìm kiếm');

    return res.status(isUserInputError ? 400 : 500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống khi tìm kiếm khách sạn'
    });
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotel,
  getHotelDetails,
  updateHotel,
  deleteHotel,
  searchHotelsController
};