const hotelService = require('../services/hotelService');

const createHotel = async (req, res) => {
  try {
    const response = await hotelService.createHotelService(req.user._id, req.body, req.files);
    return res.status(201).json(response);
  } catch (error) {
    console.error('Create hotel error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const response = await hotelService.getHotelsService(req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Get hotels error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateHotel = async (req, res) => {
  try {
    const response = await hotelService.updateHotelService(req.params.id, req.user._id, req.body, req.files);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Update hotel error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const response = await hotelService.deleteHotelService(req.params.id, req.user._id);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Delete hotel error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateHotelStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const response = await hotelService.updateHotelStatusService(req.params.id, req.user._id, status);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Update hotel status error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const searchHotelsHandler = async (req, res) => {
  try {
    const {
      location, checkInDate, checkOutDate, numberOfPeople,
      roomType, minPrice, maxPrice, amenities, category,
      minRating, maxRating, hasPromotion, page, limit
    } = req.query;

    const filters = {
      location, checkInDate, checkOutDate, numberOfPeople,
      roomType, minPrice, maxPrice, amenities, category,
      minRating, maxRating, hasPromotion
    };

    const response = await hotelService.searchHotels(filters, parseInt(page) || 1, parseInt(limit) || 10);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Search hotels error:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getHotelDetails = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { reviewPage = 1, reviewLimit = 10 } = req.query;

    const hotelDetails = await hotelService.getHotelDetails(
      hotelId,
      parseInt(reviewPage),
      parseInt(reviewLimit)
    );

    return res.status(200).json({ success: true, data: hotelDetails });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createHotel,
  getHotels,
  updateHotel,
  deleteHotel,
  updateHotelStatus,
  searchHotelsHandler,
  getHotelDetails
};
