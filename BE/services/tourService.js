const { Types } = require('mongoose');
const tourRepo = require('../repositories/tourRepository');

const toId = v => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : v);

/* ====== AUTHZ ====== */
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
  const seen = new Set();

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

    const key = `${new Date(a.date).toISOString().slice(0,10)}|${a.time||''}|${a.timeSlot||''}`;
    if (seen.has(key)) throw new Error(`availability bị trùng (date/time/timeSlot) tại index ${idx}`);
    seen.add(key);
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

/* ====== CREATE / UPDATE / READ ====== */
exports.createTour = async (body, user) => {
  const {
    name, description, itinerary,
    duration, type, serviceType, hasGuide,
    allowPrivateBooking, price, priceAdult, priceChild,
    availability, images, meals, hotels, transport,
    additionalInfo
  } = body;

  validateBusinessRules({ serviceType, hasGuide, availability, itinerary, type });

  // Đồng bộ giá: nếu chỉ có 1 trong 2 trường thì copy qua trường còn lại
  let p  = price       != null ? Number(price)       : undefined;
  let pa = priceAdult  != null ? Number(priceAdult)  : undefined;
  let pc = priceChild  != null ? Number(priceChild)  : undefined;
  if (p == null && pa != null) p = pa;
  if (pa == null && p != null) pa = p;

  return tourRepo.create({
    name,
    description,
    providerId: toId(user._id),
    itinerary,
    duration,
    type,
    serviceType,
    hasGuide,
    allowPrivateBooking: !!allowPrivateBooking,
    price: p,
    priceAdult: pa,
    priceChild: pc,
    availability,
    images,
    meals,
    hotels,
    transport,
    additionalInfo
  });
};

exports.getAllTours = (options = {}) =>
  tourRepo.findAll({ status: 'active' }, options);

exports.getTourById = (id) => tourRepo.findById(id);

exports.searchTours = async (query = {}, options = {}) => {
  const {
    search,                // keyword cho name/description (text index)
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

  // Default chỉ trả active nếu không truyền status
  if (status) andFilters.push({ status });
  else andFilters.push({ status: 'active' });

  if (type)        andFilters.push({ type });
  if (serviceType) andFilters.push({ serviceType });
  if (providerId)  andFilters.push({ providerId: toId(providerId) });

  if (hasGuide !== undefined) {
    andFilters.push({ hasGuide: String(hasGuide) === 'true' });
  }
  if (allowPrivateBooking !== undefined) {
    andFilters.push({ allowPrivateBooking: String(allowPrivateBooking) === 'true' });
  }

  // Price range áp trên 3 field
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

  if (ratingMin !== undefined) {
    andFilters.push({ rating: { $gte: Number(ratingMin) } });
  }

  // Text search theo index (name, description)
  if (search) {
    andFilters.push({ $text: { $search: search } });
  }

  // Date trong availability
  if (dateFrom) {
    andFilters.push({
      availability: {
        $elemMatch: {
          date:   { $gte: new Date(dateFrom) },
          status: 'available',
          isPrivate: false
        }
      }
    });
  }

  const finalFilter = andFilters.length ? { $and: andFilters } : {};
  return tourRepo.search(finalFilter, options);
};

exports.updateTour = async (id, updates, user) => {
  const tour = await tourRepo.findById(id);
  ensureCanEdit(tour, user);

  const allowed = [
    'name','description','itinerary','duration','type','serviceType','hasGuide',
    'allowPrivateBooking','price','priceAdult','priceChild','availability','images',
    'meals','hotels','transport','additionalInfo','status'
  ];
  const sanitized = {};
  for (const k of allowed) if (k in updates) sanitized[k] = updates[k];

  // chỉ admin được đổi status
  if ('status' in sanitized && user.role !== 'admin') {
    delete sanitized.status;
  }

  // đồng bộ giá nếu có chỉnh
  if ('price' in sanitized || 'priceAdult' in sanitized) {
    const p  = sanitized.price       ?? tour.price;
    const pa = sanitized.priceAdult  ?? tour.priceAdult ?? p;
    sanitized.price = p ?? pa;
    sanitized.priceAdult = pa ?? p;
  }

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