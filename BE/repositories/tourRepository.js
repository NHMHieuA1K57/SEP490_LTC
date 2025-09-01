const Tour = require('../models/Tour');

exports.create = (data) => new Tour(data).save();

exports.findAll = async (filter = {}, { page = 1, limit = 20, sort = '-createdAt', select } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Tour.find(filter).sort(sort).skip(skip).limit(limit).select(select).lean().exec(),
    Tour.countDocuments(filter)
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
};

exports.search = async (filter = {}, { page = 1, limit = 20, sort = '-createdAt', select } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Tour.find(filter).sort(sort).skip(skip).limit(limit).select(select).lean().exec(),
    Tour.countDocuments(filter)
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
};

exports.findById = (id) =>
  Tour.findById(id)
    .lean();

exports.updateById = (id, updates) =>
  Tour.findByIdAndUpdate(id, updates, { new: true }).lean();

exports.softDeleteById = async (id) => {
  const tour = await Tour.findById(id);
  if (!tour) return null;
  tour.status = 'inactive';
  return tour.save();
};