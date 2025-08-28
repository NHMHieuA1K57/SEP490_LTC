const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// public
router.get('/', tourController.getAllTours);
router.get('/search', tourController.searchTours);
router.get('/:id', tourController.getTourById);

// protected
router.post('/',
  authMiddleware,
  roleMiddleware(['tour_provider', 'admin']),
  tourController.createTour
);

router.put('/:id',
  authMiddleware,
  roleMiddleware(['tour_provider', 'admin']),
  tourController.updateTour
);

router.delete('/:id',
  authMiddleware,
  roleMiddleware(['tour_provider', 'admin']),
  tourController.deleteTour
);

module.exports = router;
