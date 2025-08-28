const tourService = require('../services/tourService');

exports.createTour = async (req, res) => {
  try {
    const tour = await tourService.createTour(req.body, req.user); // tự gán providerId từ token
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

exports.getAllTours = async (_req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.json({ success: true, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchTours = async (req, res) => {
  try {
    const tours = await tourService.searchTours(req.query);
    res.json({ success: true, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body, req.user);
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await tourService.deleteTour(req.params.id, req.user);
    res.json({ success: true, message: 'Tour deactivated successfully' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
