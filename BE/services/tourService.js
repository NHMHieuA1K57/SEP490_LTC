// services/tourService.js
const { Types } = require('mongoose');
const tourRepo = require('../repositories/tourRepository');

const toId = v => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : v);

function ensureCanEdit(tour, user) {
  if (!tour) {
    const err = new Error('Tour not found');
    err.status = 404;
    throw err;
  }
  if (user.role !== 'admin' && String(tour.providerId) !== String(user._id)) {
    const err = new Error('Bạn không có quyền thao tác tour này');
    err.status = 403;
    throw err;
  }
}

/* ====== VALIDATIONS ====== */
function validateItinerary(itinerary = []) {
  if (!Array.isArray(itinerary) || itinerary.length === 0) return;
  // day phải là 1..N, tăng dần, không trùng/lỗ hổng
  const days = itinerary.map(i => i.day).sort((a, b) => a - b);
  for (let i = 0; i < days.length; i++) {
    if (!Number.isInteger(days[i]) || days[i] !== i + 1) {
      throw new Error('Itinerary không hợp lệ: day phải là 1,2,3,... theo thứ tự tăng dần.');
    }
  }
}

function validateAvailability(availability = [], { type } = {}) {
  if (!Array.isArray(availability)) return;
  const now = Date.now();

  availability.forEach((a, idx) => {
    if (!a?.date) throw new Error(`availability[${idx}].date là bắt buộc`);
    const start = new Date(a.date).getTime();
    if (Number.isNaN(start)) throw new Error(`availability[${idx}].date không hợp lệ`);
    if (start < now) throw new Error(`Ngày xuất phát availability[${idx}] phải ở tương lai`);

    if (a.endDate) {
      const end = new Date(a.endDate).getTime();
      if (Number.isNaN(end)) throw new Error(`availability[${idx}].endDate không hợp lệ`);
      if (end < start) throw new Error(`endDate phải ≥ date tại availability[${idx}]`);
    }

    if (typeof a.slots !== 'number' || a.slots <= 0) {
      throw new Error(`availability[${idx}].slots phải là số dương`);
    }

    if (type === 'half-day' && !a.timeSlot && !a.time) {
      throw new Error(`Tour half-day cần timeSlot hoặc time tại availability[${idx}]`);
    }
  });
}

function validateBusinessRules({ serviceType, hasGuide, availability, itinerary, type }) {
  if (serviceType === 'guided_tour' && hasGuide !== true) {
    throw new Error('Tour có hướng dẫn viên cần hasGuide = true');
  }
  if (serviceType === 'ticket' && (!availability || availability.length === 0)) {
    throw new Error('Vé tham quan phải có ít nhất 1 ngày sử dụng');
  }

  validateItinerary(itinerary);
  validateAvailability(availability, { type });
}

/* ====== CREATE / UPDATE ====== */
exports.createTour = async (body, user) => {
  const {
    name, description, itinerary,
    duration, type, serviceType, hasGuide,
    allowPrivateBooking, price, priceAdult, priceChild,
    availability, images, meals, hotels, transport
  } = body;

  validateBusinessRules({ serviceType, hasGuide, availability, itinerary, type });

  return await tourRepo.create({
    name,
    description,
    providerId: toId(user._id), // gán từ token
    itinerary,
    duration,
    type,
    serviceType,
    hasGuide,
    allowPrivateBooking: !!allowPrivateBooking,
    price: price != null ? Number(price) : undefined,
    priceAdult: priceAdult != null ? Number(priceAdult) : undefined,
    priceChild: priceChild != null ? Number(priceChild) : undefined,
    availability,
    images,
    meals,
    hotels,
    transport
  });
};

exports.getAllTours = () => tourRepo.findAll({ status: 'active' });

exports.searchTours = async (query) => {
  const {
    search,                // keyword cho name/description
    type,                  // 'multi-day' | 'half-day'
    serviceType,           // 'guided_tour' | 'transport_only' | 'ticket' | 'combo'
    hasGuide,              // 'true' | 'false'
    allowPrivateBooking,   // 'true' | 'false'
    priceMin, priceMax,    // số
    ratingMin,             // số
    dateFrom,              // ISO date
    providerId,            // ObjectId (string)
    status                 // 'active' | 'pending' | 'inactive'
  } = query;

  const andFilters = [];

  // ====== Filter cố định ======
  if (type)        andFilters.push({ type });
  if (serviceType) andFilters.push({ serviceType });
  if (status)      andFilters.push({ status });
  if (providerId)  andFilters.push({ providerId: toId(providerId) });

  if (hasGuide !== undefined) {
    andFilters.push({ hasGuide: String(hasGuide) === 'true' });
  }
  if (allowPrivateBooking !== undefined) {
    andFilters.push({ allowPrivateBooking: String(allowPrivateBooking) === 'true' });
  }

  // ====== Price range trên 3 field ======
  if (priceMin || priceMax) {
    const r = {};
    if (priceMin !== undefined) r.$gte = Number(priceMin);
    if (priceMax !== undefined) r.$lte = Number(priceMax);
    andFilters.push({
      $or: [
        { price: r },
        { priceAdult: r },
        { priceChild: r }
      ]
    });
  }

  // ====== Rating ======
  if (ratingMin !== undefined) {
    andFilters.push({ rating: { $gte: Number(ratingMin) } });
  }

  // ====== Keyword (name, description) ======
  if (search) {
    andFilters.push({
      $or: [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    });
  }

  // ====== Date trong availability ======
  if (dateFrom) {
    andFilters.push({
      availability: {
        $elemMatch: {
          date:   { $gte: new Date(dateFrom) },
          status: 'available'
        }
      }
    });
  }

  // ====== Final filter  ======
  const finalFilter = andFilters.length > 0 ? { $and: andFilters } : {};

  return tourRepo.search(finalFilter);
};

exports.getTourById = (id) => tourRepo.findById(id);

exports.updateTour = async (id, updates, user) => {
  const tour = await tourRepo.findById(id);
  ensureCanEdit(tour, user);

  // chỉ nhận các field cho phép
  const allowed = [
    'name','description','itinerary','duration','type','serviceType','hasGuide',
    'allowPrivateBooking','price','priceAdult','priceChild','availability','images',
    'meals','hotels','transport','status'
  ];
  const sanitized = {};
  for (const k of allowed) if (k in updates) sanitized[k] = updates[k];

  // validate phần có thay đổi
  validateBusinessRules({
    serviceType: sanitized.serviceType ?? tour.serviceType,
    hasGuide: sanitized.hasGuide ?? tour.hasGuide,
    availability: sanitized.availability ?? tour.availability,
    itinerary: sanitized.itinerary ?? tour.itinerary,
    type: sanitized.type ?? tour.type
  });

  return tourRepo.updateById(id, sanitized);
};

exports.deleteTour = async (id, user) => {
  const tour = await tourRepo.findById(id);
  ensureCanEdit(tour, user);
  await tourRepo.softDeleteById(id);
};
