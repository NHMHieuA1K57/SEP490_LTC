const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Review = require("../models/Review");
const User = require("../models/User");

const HotelRepository = {
  createHotel: async (hotelData) => await Hotel.create(hotelData),

  findHotelsByOwnerId: async (ownerId) =>
    await Hotel.find({ ownerId })
      .select(
        "name address description images amenities status createdAt updatedAt additionalInfo rating"
      )
      .lean(),

  findHotelById: async (hotelId, ownerId) =>
    await Hotel.findOne({ _id: hotelId, ownerId })
      .select(
        "name address description images amenities status createdAt updatedAt additionalInfo rating rooms location"
      )
      .populate("rooms")
      .lean(),

  getHotelDetails: async (hotelId, filters = {}) => {
    const { checkInDate, checkOutDate, numberOfPeople } = filters;
    const roomQuery = { hotelId, status: "active" };
    if (checkInDate && checkOutDate && numberOfPeople) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      if (!isNaN(checkIn) && !isNaN(checkOut) && numberOfPeople > 0) {
        roomQuery.availability = {
          $elemMatch: {
            date: { $gte: checkIn, $lte: checkOut },
            quantity: { $gte: parseInt(numberOfPeople) },
          },
        };
        roomQuery.maxPeople = { $gte: parseInt(numberOfPeople) };
      }
    }
    const hotel = await Hotel.findOne({ _id: hotelId, status: "active" })
      .select(
        "name address description images amenities rating reviewCount status createdAt updatedAt additionalInfo location"
      )
      .populate({
        path: "rooms",
        match: roomQuery,
        select:
          "roomType price availability status description amenities images maxPeople area",
      })
      .lean();

    if (!hotel) throw new Error("Khách sạn không tồn tại hoặc không hoạt động");

    const reviews = await Review.find({ hotelId })
      .select("userId comment createdAt")
      .lean();
    const userIds = reviews.map((review) => review.userId);
    const users = await User.find({ _id: { $in: userIds } })
      .select("name")
      .lean();
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user.name || "Khách ẩn danh";
      return map;
    }, {});

    return {
      basicInfo: {
        name: hotel.name || "",
        address: hotel.address || "",
        location: {
          latitude: hotel.location.coordinates[1] || 0,
          longitude: hotel.location.coordinates[0] || 0,
        },
        description: hotel.description || "",
      },
      images: hotel.images || [],
      amenities: hotel.amenities || [],
      rating: {
        average: hotel.rating || 0,
        reviewCount: hotel.reviewCount || reviews.length,
      },
      rooms: hotel.rooms
        ? hotel.rooms.map((room) => ({
            id: room._id.toString(),
            name: room.roomType || "",
            pricePerNight: room.price || 0,
            maxPeople: room.maxPeople || 2,
            area: room.area || 0,
            amenities: room.amenities || [],
            availability: room.availability
              ? room.availability.map((slot) => ({
                  date: slot.date,
                  available: slot.quantity > 0,
                  quantity: slot.quantity,
                }))
              : [],
            description: room.description || "",
            images: room.images || [],
          }))
        : [],
      reviews: reviews.map((review) => ({
        username: userMap[review.userId.toString()] || "Khách ẩn danh",
        content: review.comment || "",
        date: review.createdAt || new Date(),
      })),
      policies: {
        checkInTime: hotel.additionalInfo?.policies?.checkInTime || "",
        checkOutTime: hotel.additionalInfo?.policies?.checkOutTime || "",
        cancellation: hotel.additionalInfo?.policies?.cancellation || "",
        payment: hotel.additionalInfo?.policies?.depositRequired
          ? "Yêu cầu đặt cọc"
          : "Không yêu cầu đặt cọc",
      },
      contact: {
        phone: hotel.additionalInfo?.contact?.phone || "",
        email: hotel.additionalInfo?.contact?.email || "",
        website: hotel.additionalInfo?.contact?.website || "",
      },
    };
  },

  updateHotel: async (hotelId, ownerId, updates) =>
    await Hotel.findOneAndUpdate(
      { _id: hotelId, ownerId },
      { $set: { ...updates, updatedAt: new Date() } },
      { new: true, runValidators: true }
    )
      .select(
        "name address description images amenities status createdAt updatedAt additionalInfo rating rooms location"
      )
      .populate("rooms")
      .lean(),

  deleteHotel: async (hotelId, ownerId) => {
    const activeBookings = await Booking.countDocuments({
      hotelId,
      status: { $in: ["pending", "confirmed"] },
    });
    if (activeBookings > 0)
      throw new Error(
        "Không thể xóa khách sạn vì còn đặt phòng đang hoạt động"
      );
    return await Hotel.findOneAndDelete({ _id: hotelId, ownerId });
  },

  async searchHotelsBasic(filters) {
    const {
      keyword = "",
      checkInDate,
      checkOutDate,
      adults = 1,
      children = 0,
      numberOfRooms = 1,
    } = filters;

    if (!keyword || !keyword.trim()) {
      throw new Error("Vui lòng nhập từ khóa tìm kiếm");
    }

    const totalPeople = Number(adults) + Number(children);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if ((checkInDate && isNaN(checkIn)) || (checkOutDate && isNaN(checkOut))) {
      throw new Error("Ngày check-in hoặc check-out không hợp lệ");
    }

    const plainKeyword = removeAccents((keyword || "").trim().toLowerCase());
    const allHotels = await Hotel.find({ status: "active" }).lean();

    let hotels = allHotels;

    if (plainKeyword.trim()) {
      hotels = allHotels.filter((hotel) => {
        const combined = `${hotel.name || ""} ${hotel.address || ""}`;
        const normalized = removeAccents(combined).toLowerCase();
        return normalized.includes(plainKeyword);
      });
    }

    if (!hotels.length) return [];

    if (!checkInDate || !checkOutDate) {
      return hotels.map((h) => ({ hotel: h, rooms: [] }));
    }

    const hotelIds = hotels.map((h) => h._id);
    const rooms = await Room.find({
      hotelId: { $in: hotelIds },
      maxPeople: { $gte: totalPeople },
      status: "active",
    }).lean();

    const availableRoomsByHotel = {};

    for (const room of rooms) {
      let hasEnough = true;
      for (
        let d = new Date(checkIn);
        d < checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        const availability = room.availability.find(
          (av) => new Date(av.date).toISOString().split("T")[0] === dateStr
        );
        if (!availability || availability.quantity < numberOfRooms) {
          hasEnough = false;
          break;
        }
      }

      if (hasEnough) {
        const hotelIdStr = room.hotelId.toString();
        if (!availableRoomsByHotel[hotelIdStr]) {
          availableRoomsByHotel[hotelIdStr] = [];
        }
        availableRoomsByHotel[hotelIdStr].push(room);
      }
    }

    const matchedHotels = hotels
      .filter((hotel) => availableRoomsByHotel[hotel._id.toString()])
      .map((hotel) => ({
        hotel,
        rooms: availableRoomsByHotel[hotel._id.toString()],
      }));

    return matchedHotels;
  },

  async searchHotelsAdvanced(filters) {
    const {
      keyword = "",
      checkInDate,
      checkOutDate,
      adults = 1,
      children = 0,
      numberOfRooms = 1,
      minPrice,
      maxPrice,
      roomType,
      amenities,
      category,
      minRating,
      maxRating,
    } = filters;

    const totalPeople = Number(adults) + Number(children);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const plainKeyword = removeAccents(keyword);
    const allHotels = await Hotel.find({ status: "active" }).lean();

    const hotels = allHotels.filter((hotel) => {
      const name = hotel.name || "";
      const address = hotel.address || "";
      const combined = `${name} ${address}`.toLowerCase();
      const normalized = removeAccents(combined);
      return normalized.includes(plainKeyword);
    });

    if (!hotels.length) return [];

    const hotelIds = hotels.map((h) => h._id);
    const roomQuery = {
      hotelId: { $in: hotelIds },
      maxPeople: { $gte: totalPeople },
      status: "active",
    };

    if (minPrice || maxPrice) {
      roomQuery.price = {};
      if (minPrice) roomQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) roomQuery.price.$lte = parseFloat(maxPrice);
    }

    if (roomType) roomQuery.roomType = roomType;
    if (amenities) roomQuery.amenities = { $all: amenities.split(",") };

    const rooms = await Room.find(roomQuery).lean();
    const availableRoomsByHotel = {};

    for (const room of rooms) {
      let hasEnough = true;
      for (
        let d = new Date(checkIn);
        d < checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        const availability = room.availability.find(
          (av) => new Date(av.date).toISOString().split("T")[0] === dateStr
        );
        if (!availability || availability.quantity < numberOfRooms) {
          hasEnough = false;
          break;
        }
      }

      if (hasEnough) {
        const hotelIdStr = room.hotelId.toString();
        if (!availableRoomsByHotel[hotelIdStr]) {
          availableRoomsByHotel[hotelIdStr] = [];
        }
        availableRoomsByHotel[hotelIdStr].push(room);
      }
    }

    const matchedHotels = hotels
      .filter((hotel) => {
        const rooms = availableRoomsByHotel[hotel._id.toString()];
        if (!rooms) return false;

        const rating = hotel.rating || 0;
        const cat = hotel.additionalInfo?.category || "";

        if (minRating && rating < parseFloat(minRating)) return false;
        if (maxRating && rating > parseFloat(maxRating)) return false;
        if (category && !category.split(",").includes(cat)) return false;

        return true;
      })
      .map((hotel) => ({
        hotel,
        rooms: availableRoomsByHotel[hotel._id.toString()] || [],
      }));

    return matchedHotels;
  },
  getAllHotels: async () =>
    await Hotel.find({})
      .populate({ path: "rooms", select: "price roomType maxPeople" })
      .select("name images address rating reviewCount amenities status")
      .lean(),
};
// const removeAccents = (str) => {
//   return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
// };
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

module.exports = HotelRepository;
