const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const roomController = require('../controllers/roomController');
const bookingController = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.get('/search/hotels',hotelController.searchHotelsHandler);
router.get('/:hotelId', hotelController.getHotelDetails);
router.get('/:hotelId/rooms/:roomId', roomController.getRoomDetails);


router.post('/', authMiddleware, roleMiddleware(['hotel_owner']), upload.array('images', 10), hotelController.createHotel);
router.get('/', authMiddleware, roleMiddleware(['hotel_owner']), hotelController.getHotels);
router.patch('/:id', authMiddleware, roleMiddleware(['hotel_owner']), upload.array('images', 10), hotelController.updateHotel);
router.delete('/:id', authMiddleware, roleMiddleware(['hotel_owner']), hotelController.deleteHotel);
router.patch('/:id/status', authMiddleware, roleMiddleware(['hotel_owner']), hotelController.updateHotelStatus);

router.post('/:hotelId/room', authMiddleware, roleMiddleware(['hotel_owner']), upload.array('images', 5), roomController.createRoom);
router.get('/:hotelId/room', authMiddleware, roleMiddleware(['hotel_owner']), roomController.getRooms);
router.patch('/:hotelId/room/:roomId', authMiddleware, roleMiddleware(['hotel_owner']), upload.array('images', 5), roomController.updateRoom);
router.delete('/:hotelId/room/:roomId', authMiddleware, roleMiddleware(['hotel_owner']), roomController.deleteRoom);
router.patch('/:hotelId/room/:roomId/availability', authMiddleware, roleMiddleware(['hotel_owner']), roomController.updateRoomAvailability);
router.patch('/:hotelId/room/:roomId/price', authMiddleware, roleMiddleware(['hotel_owner']), roomController.updateRoomPrice);


router.get('/booking', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.getBookings);
router.get('/booking/:bookingId', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.getBookingById);
router.patch('/booking/:bookingId/confirm', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.confirmBooking);
router.patch('/booking/:bookingId/cancel', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.cancelBooking);
router.get('/booking/history', authMiddleware, roleMiddleware(['hotel_owner']), bookingController.getBookingHistory);

module.exports = router;