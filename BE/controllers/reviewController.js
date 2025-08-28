// controllers/reviewController.js
const reviewService = require('../services/reviewService');

module.exports = {
  async create(req, res, next) {
    try {
      const userId = req.user.id || req.user._id;
      const review = await reviewService.createReview({ ...req.body, userId });
      res.status(201).json({ success: true, data: review });
    } catch (err) { next(err); }
  },

  async list(req, res, next) {
    try {
      const data = await reviewService.listReviews(req.query);
      res.json({ success: true, ...data });
    } catch (err) { next(err); }
  },

  async helpful(req, res, next) {
    try {
      const userId = req.user.id || req.user._id;
      await reviewService.voteHelpful({
        reviewId: req.params.id,
        userId,
        on: req.body.on !== false
      });
      res.json({ success: true });
    } catch (err) { next(err); }
  },

  async reply(req, res, next) {
    try {
      const userId = req.user.id || req.user._id;
      const review = await reviewService.replyReview({
        reviewId: req.params.id,
        userId,
        content: req.body.content
      });
      res.json({ success: true, data: review });
    } catch (err) { next(err); }
  },

  async changeStatus(req, res, next) {
    try {
      const review = await reviewService.changeStatus({
        reviewId: req.params.id,
        status: req.body.status
      });
      res.json({ success: true, data: review });
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      await reviewService.deleteReview(req.params.id);
      res.json({ success: true });
    } catch (err) { next(err); }
  },

  // Reports
  async report(req, res, next) {
    try {
      const reporterId = req.user.id || req.user._id;
      const report = await reviewService.reportReview({
        reviewId: req.params.id,
        reporterId,
        reason: req.body.reason,
        note: req.body.note
      });
      res.status(201).json({ success: true, data: report });
    } catch (err) { next(err); }
  },

  async listReports(req, res, next) {
    try {
      const reports = await reviewService.listReports();
      res.json({ success: true, data: reports });
    } catch (err) { next(err); }
  },

  async handleReport(req, res, next) {
    try {
      const report = await reviewService.handleReport({
        reportId: req.params.id,
        status: req.body.status
      });
      res.json({ success: true, data: report });
    } catch (err) { next(err); }
  }
};
