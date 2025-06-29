const roomService = require('../services/roomService');

// Generic error handler
const handleError = (res, error) => {
  console.error(`${error.message}`);
  return res.status(400).json({ success: false, message: error.message });
};

// Create a new room
const createRoom = async (req, res) => {
  try {
    const response = await roomService.createRoomService(
      req.params.hotelId,
      req.user._id,
      req.body,
      req.files
    );
    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get all rooms for a hotel
const getRooms = async (req, res) => {
  try {
    const response = await roomService.getRoomsService(req.params.hotelId, req.user._id);
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update a room
const updateRoom = async (req, res) => {
  try {
    const response = await roomService.updateRoomService(
      req.params.hotelId,
      req.params.roomId,
      req.user._id,
      req.body,
      req.files
    );
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete a room
const deleteRoom = async (req, res) => {
  try {
    const response = await roomService.deleteRoomService(
      req.params.hotelId,
      req.params.roomId,
      req.user._id
    );
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return handleError(res, error);
  }
};
  
  // Update room availability
  const updateRoomAvailability = async (req, res) => {
    try {
      const { availability } = req.body;
      const response = await roomService.updateRoomAvailabilityService(
        req.params.hotelId,
        req.params.roomId,
        req.user._id,
        availability
      );
      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      return handleError(res, error);
    }
  };
  
  // Update room price
  const updateRoomPrice = async (req, res) => {
    try {
      const { price } = req.body;
      const response = await roomService.updateRoomPriceService(
        req.params.hotelId,
        req.params.roomId,
        req.user._id,
        price
      );
      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      return handleError(res, error);
    }
  };
  
  // Get room details
  const getRoomDetails = async (req, res) => {
    try {
      const { hotelId, roomId } = req.params;
      const response = await roomService.getRoomDetails(hotelId, roomId);
      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      return handleError(res, error);
    }
  };
  
  module.exports = {
    createRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    updateRoomAvailability,
    updateRoomPrice,
    getRoomDetails
  };