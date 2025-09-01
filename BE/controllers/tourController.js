const tourService = require('../services/tourService');

exports.createTour = async (req, res) => {
  try {
    const tour = await tourService.createTour(req.body, req.user);
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const result = await tourService.getAllTours({
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
      sort
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchTours = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt', ...filters } = req.query;
    const result = await tourService.searchTours(filters, {
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
      sort
    });
    res.json({ success: true, ...result });
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