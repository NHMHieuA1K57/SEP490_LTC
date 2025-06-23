const Tour = require("../models/Tour");
const TourBooking = require("../models/TourBooking");

// Đặt tour
exports.bookTour = async (req, res) => {
  try {
    const {
      tourId,
      availabilityId,
      quantityAdult = 1,
      quantityChild = 0,
      isPrivateBooking = false,
      note,
      paymentMethod = "payos"
    } = req.body;

    // Lấy user đang login (nếu dùng middleware verifyToken)
    const customerId = req.user?._id || req.body.customerId;
if (!customerId) {
  return res.status(401).json({ message: "Vui lòng đăng nhập để đặt tour" });
}
    if (!availabilityId || typeof availabilityId !== "string") {
      return res.status(400).json({ message: "Thiếu hoặc sai availabilityId" });
    }

    // Lấy tour
    const tour = await Tour.findById(tourId);
    if (!tour || tour.status !== 'active') {
      return res.status(404).json({ message: "Tour không tồn tại hoặc không hoạt động" });
    }

    // Kiểm tra logic private
    if (isPrivateBooking) {
      if (tour.serviceType !== 'guided_tour' || !tour.allowPrivateBooking) {
        return res.status(400).json({ message: "Tour này không hỗ trợ đặt riêng" });
      }
    }

    // Tìm availability theo ID
    const availability = tour.availability.find(
      (a) => a._id.toString() === availabilityId
    );

    if (!availability) {
      return res.status(400).json({ message: "Không tìm thấy ngày khởi hành tương ứng" });
    }

    const totalPeople = quantityAdult + quantityChild;

    // Nếu không phải tour riêng → check slot còn không
    if (!isPrivateBooking) {
      if (availability.slots < totalPeople) {
        return res.status(400).json({ message: `Chỉ còn ${availability.slots} chỗ cho ngày này` });
      }
      availability.slots -= totalPeople; // trừ chỗ
    } else {
      availability.isPrivate = true; // khóa slot nếu là tour bao
    }

    // Tính giá
    const priceAdult = tour.priceAdult || tour.price;
    const priceChild = tour.priceChild || tour.price;
    const totalPrice = quantityAdult * priceAdult + quantityChild * priceChild;

    // Lưu tour booking
    const booking = new TourBooking({
      tourId,
      customerId,
      availabilityId,
      quantityAdult,
      quantityChild,
      isPrivateBooking,
      totalPrice,
      paymentMethod,
      note
    });

    await booking.save();
    await tour.save(); // Lưu lại slot đã cập nhật

    res.status(201).json({ message: "Đặt tour thành công", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
