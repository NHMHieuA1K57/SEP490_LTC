const TourBooking = require('../models/TourBooking');

exports.create = (data, opts = {}) => {
  const doc = new TourBooking(data);
  return doc.save(opts);
};

exports.findById = (id) =>
  TourBooking.findById(id)
    .populate({ path: 'tourId', select: 'name providerId price priceAdult priceChild images' })
    .populate({ path: 'customerId', select: 'name email phone' });

exports.updateStatus = (id, status, opts = {}) =>
  TourBooking.findByIdAndUpdate(id, { status }, { new: true, ...opts });

exports.updatePaymentStatus = (id, paymentStatus, opts = {}) =>
  TourBooking.findByIdAndUpdate(id, { 'payment.status': paymentStatus }, { new: true, ...opts });

exports.search = async (filter = {}, options = {}) => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 20;
  const sort = options.sort ?? '-createdAt';

  const [items, total] = await Promise.all([
    TourBooking.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'tourId', select: 'name providerId price images status' })
      .populate({ path: 'customerId', select: 'name email phone' })
      .lean()
      .exec(),
    TourBooking.countDocuments(filter)
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
};

exports.findByCustomer = async (customerId, options = {}) => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 20;
  const sort = options.sort ?? '-createdAt';

  const [items, total] = await Promise.all([
    TourBooking.find({ customerId })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'tourId', select: 'name images price priceAdult priceChild' })
      .lean()
      .exec(),
    TourBooking.countDocuments({ customerId })
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
};
