const bookingService = require("../services/bookingService");
const bookingRepository = require("../repositories/bookingRepository");
const roomRepository = require("../repositories/roomRepository");
const mongoose = require("mongoose");
const PayOS = require("@payos/node");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// Mock dependencies
jest.mock("../repositories/bookingRepository");
jest.mock("../repositories/roomRepository");
jest.mock("@payos/node");
jest.mock("../models/User");
jest.mock("../models/Hotel");
jest.mock("../models/Booking");
jest.spyOn(mongoose, "startSession").mockResolvedValue({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
});

// Utility
const validObjectId = new mongoose.Types.ObjectId().toString();

describe("Booking Service Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== getPendingBookingsService ==========
  describe("getPendingBookingsService", () => {
    it("should throw error if page < 1", async () => {
      await expect(
        bookingService.getPendingBookingsService("owner", {}, 0, 10)
      ).rejects.toThrow("Trang và giới hạn phải lớn hơn 0");
    });

    it("should throw error if hotelId invalid", async () => {
      await expect(
        bookingService.getPendingBookingsService("owner", { hotelId: "abc" }, 1, 10)
      ).rejects.toThrow("ID khách sạn không hợp lệ");
    });

    it("should call bookingRepository.getPendingBookings with correct params", async () => {
      bookingRepository.getPendingBookings.mockResolvedValue(["booking1"]);
      const result = await bookingService.getPendingBookingsService(
        "owner1",
        { hotelId: validObjectId },
        1,
        10
      );
      expect(bookingRepository.getPendingBookings).toHaveBeenCalledWith(
        "owner1",
        { hotelId: validObjectId },
        1,
        10
      );
      expect(result).toEqual(["booking1"]);
    });
  });

  // ========== getBookingsByOwnerHotelsService ==========
  describe("getBookingsByOwnerHotelsService", () => {
    it("should throw error if status is invalid", async () => {
      await expect(
        bookingService.getBookingsByOwnerHotelsService("owner", { status: "wrong" }, 1, 10)
      ).rejects.toThrow("Trạng thái không hợp lệ");
    });

    it("should throw error if fromDate invalid", async () => {
      await expect(
        bookingService.getBookingsByOwnerHotelsService("owner", { fromDate: "xxx" }, 1, 10)
      ).rejects.toThrow("Ngày bắt đầu không hợp lệ");
    });

    it("should throw error if toDate < fromDate", async () => {
      await expect(
        bookingService.getBookingsByOwnerHotelsService(
          "owner",
          { fromDate: "2025-09-10", toDate: "2025-09-01" },
          1,
          10
        )
      ).rejects.toThrow("Ngày bắt đầu phải trước ngày kết thúc");
    });

    it("should return bookings from repository", async () => {
      bookingRepository.getBookingsByOwnerHotels.mockResolvedValue(["b1", "b2"]);
      const result = await bookingService.getBookingsByOwnerHotelsService(
        "owner",
        { status: "pending" },
        1,
        10
      );
      expect(result).toEqual(["b1", "b2"]);
    });
  });

  // ========== getBookingDetailsService ==========
  describe("getBookingDetailsService", () => {
    it("should throw error if bookingId invalid", async () => {
      await expect(
        bookingService.getBookingDetailsService("abc", "owner")
      ).rejects.toThrow("ID đặt phòng không hợp lệ");
    });

    it("should call repository with valid bookingId", async () => {
      bookingRepository.getBookingDetails.mockResolvedValue("detail");
      const result = await bookingService.getBookingDetailsService(validObjectId, "owner");
      expect(result).toBe("detail");
      expect(bookingRepository.getBookingDetails).toHaveBeenCalledWith(validObjectId, "owner");
    });
  });

  // ========== updateBookingStatusService ==========
  describe("updateBookingStatusService", () => {
    it("should throw error if bookingId invalid", async () => {
      await expect(
        bookingService.updateBookingStatusService("xxx", "owner", "pending")
      ).rejects.toThrow("ID đặt phòng không hợp lệ");
    });

    it("should throw error if status invalid", async () => {
      await expect(
        bookingService.updateBookingStatusService(validObjectId, "owner", "wrong")
      ).rejects.toThrow("Trạng thái không hợp lệ");
    });

    it("should call repository if inputs valid", async () => {
      bookingRepository.updateBookingStatus.mockResolvedValue("updated");
      const result = await bookingService.updateBookingStatusService(
        validObjectId,
        "owner",
        "confirmed"
      );
      expect(result).toBe("updated");
      expect(bookingRepository.updateBookingStatus).toHaveBeenCalled();
    });
  });

  // ========== createBookingService ==========
  describe("createBookingService", () => {
    it("should throw error if invalid ObjectIds", async () => {
      await expect(
        bookingService.createBookingService("bad", { hotelId: "bad", roomId: "bad" })
      ).rejects.toThrow("ID người dùng, khách sạn hoặc phòng không hợp lệ");
    });

    it("should throw error if missing buyer info", async () => {
      await expect(
        bookingService.createBookingService(validObjectId, {
          hotelId: validObjectId,
          roomId: validObjectId,
          numberOfPeople: 0,
        })
      ).rejects.toThrow("Thông tin người mua và số người là bắt buộc");
    });

    it("should throw error if invalid dates", async () => {
      await expect(
        bookingService.createBookingService(validObjectId, {
          hotelId: validObjectId,
          roomId: validObjectId,
          buyerName: "A",
          buyerEmail: "a@test.com",
          numberOfPeople: 2,
          checkInDate: "2025-09-10",
          checkOutDate: "2025-09-09",
        })
      ).rejects.toThrow("Ngày check-in/check-out không hợp lệ");
    });

    it("should throw error if duplicate booking exists", async () => {
      Booking.findOne.mockResolvedValue(true);
      await expect(
        bookingService.createBookingService(validObjectId, {
          hotelId: validObjectId,
          roomId: validObjectId,
          buyerName: "A",
          buyerEmail: "a@test.com",
          numberOfPeople: 2,
          checkInDate: "2025-09-01",
          checkOutDate: "2025-09-05",
        })
      ).rejects.toThrow("Bạn đã đặt phòng này trong khoảng thời gian đó");
    });

    it("should create booking successfully", async () => {
      Booking.findOne.mockResolvedValue(null);
      roomRepository.findAvailableRoom.mockResolvedValue({ price: 100, roomType: "Deluxe" });
      Hotel.findOne.mockResolvedValue({ name: "Hotel1", ownerId: validObjectId, status: "active" });
      User.findById.mockResolvedValue({ businessInfo: { commissionRate: 0.1 } });
      bookingRepository.createBooking.mockResolvedValue([{ _id: validObjectId, save: jest.fn() }]);
      bookingRepository.createPayment.mockResolvedValue({});
      bookingRepository.decrementRoomAvailability.mockResolvedValue({});
      PayOS.mockImplementation(() => ({
        createPaymentLink: jest.fn().mockResolvedValue({ checkoutUrl: "http://pay.url" }),
      }));

      const result = await bookingService.createBookingService(validObjectId, {
        hotelId: validObjectId,
        roomId: validObjectId,
        buyerName: "A",
        buyerEmail: "a@test.com",
        buyerPhone: "123",
        buyerAddress: "HN",
        numberOfPeople: 2,
        checkInDate: "2025-09-01",
        checkOutDate: "2025-09-05",
      });

      expect(result.success).toBe(true);
      expect(result.data.paymentLink).toBe("http://pay.url");
    });
  });
});
