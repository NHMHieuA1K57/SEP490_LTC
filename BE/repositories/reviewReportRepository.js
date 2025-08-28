const ReviewReport = require('../models/ReviewReport');

module.exports = {
  create(data) { return ReviewReport.create(data); },
  list(filter={}) { return ReviewReport.find(filter).sort({ createdAt: -1 }); },
  updateStatus(id, status) {
    return ReviewReport.findByIdAndUpdate(id, { status }, { new: true });
  }
};
