const Tour = require("../models/Tour");
const TourBooking = require("../models/TourBooking");
const { bookTour, createTour, getAllTours, getTourById, updateTour, deleteTour } = require("../controllers/tourController");

jest.mock("../models/Tour");
jest.mock("../models/TourBooking");

const mockReq = (body = {}, params = {}, user = null) => ({
  body,
  params,
  user
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Tour Controller", () => {

  // ================= BOOK TOUR =================
  describe("bookTour", () => {
    it("should return 400 if payment method is not paypal", async () => {
      const req = mockReq({ payment: { method: "cash" } });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Hiện tại chỉ hỗ trợ thanh toán qua PayPal." });
    });

    it("should return 401 if no customerId", async () => {
      const req = mockReq({ payment: { method: "paypal" }, availabilityId: "abc" });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if availabilityId missing or not string", async () => {
      const req = mockReq({ payment: { method: "paypal" }, customerId: "c1", availabilityId: 123 });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if tour not found or inactive", async () => {
      Tour.findById.mockResolvedValue(null);
      const req = mockReq({ tourId: "t1", availabilityId: "a1", payment: { method: "paypal" }, customerId: "c1" });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if private booking not allowed", async () => {
      Tour.findById.mockResolvedValue({
        status: "active",
        serviceType: "ticket",
        allowPrivateBooking: false,
        availability: [{ _id: "a1" }]
      });
      const req = mockReq({
        tourId: "t1", availabilityId: "a1",
        isPrivateBooking: true,
        payment: { method: "paypal" }, customerId: "c1"
      });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if availability not found", async () => {
      Tour.findById.mockResolvedValue({
        status: "active",
        serviceType: "guided_tour",
        allowPrivateBooking: true,
        availability: []
      });
      const req = mockReq({
        tourId: "t1", availabilityId: "a1",
        isPrivateBooking: true,
        payment: { method: "paypal" }, customerId: "c1"
      });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if not enough slots", async () => {
      Tour.findById.mockResolvedValue({
        status: "active",
        serviceType: "guided_tour",
        allowPrivateBooking: false,
        availability: [{ _id: { toString: () => "a1" }, slots: 1 }]
      });
      const req = mockReq({
        tourId: "t1", availabilityId: "a1",
        quantityAdult: 2,
        payment: { method: "paypal" }, customerId: "c1"
      });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create booking successfully", async () => {
      const saveMock = jest.fn();
      TourBooking.mockImplementation(() => ({ save: saveMock }));
      Tour.findById.mockResolvedValue({
        status: "active",
        serviceType: "guided_tour",
        allowPrivateBooking: true,
        availability: [{ _id: { toString: () => "a1" }, slots: 5 }],
        priceAdult: 100,
        save: jest.fn()
      });
      const req = mockReq({
        tourId: "t1", availabilityId: "a1",
        quantityAdult: 2,
        payment: { method: "paypal" }, customerId: "c1"
      });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Đặt tour thành công" }));
    });

    it("should handle server error", async () => {
      Tour.findById.mockRejectedValue(new Error("DB error"));
      const req = mockReq({ tourId: "t1", availabilityId: "a1", payment: { method: "paypal" }, customerId: "c1" });
      const res = mockRes();
      await bookTour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ================= CREATE TOUR =================
  describe("createTour", () => {
    it("should return 400 if guided_tour but hasGuide not true", async () => {
      const req = mockReq({ serviceType: "guided_tour", hasGuide: false });
      const res = mockRes();
      await createTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if ticket but no availability", async () => {
      const req = mockReq({ serviceType: "ticket", availability: [] });
      const res = mockRes();
      await createTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create tour successfully", async () => {
      const saveMock = jest.fn();
      Tour.mockImplementation(() => ({ save: saveMock }));
      const req = mockReq({ serviceType: "ticket", availability: [{}], hasGuide: false });
      const res = mockRes();
      await createTour(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle server error", async () => {
      Tour.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(new Error("DB error")) }));
      const req = mockReq({ serviceType: "ticket", availability: [{}] });
      const res = mockRes();
      await createTour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ================= GET ALL TOURS =================
  describe("getAllTours", () => {
    it("should return list of tours", async () => {
      Tour.find.mockResolvedValue([{ name: "Tour 1" }]);
      const req = mockReq();
      const res = mockRes();
      await getAllTours(req, res);
      expect(res.json).toHaveBeenCalledWith([{ name: "Tour 1" }]);
    });

    it("should handle server error", async () => {
      Tour.find.mockRejectedValue(new Error("DB error"));
      const req = mockReq();
      const res = mockRes();
      await getAllTours(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ================= GET TOUR BY ID =================
  describe("getTourById", () => {
    it("should return tour if found", async () => {
      Tour.findById.mockResolvedValue({ name: "Tour 1" });
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await getTourById(req, res);
      expect(res.json).toHaveBeenCalledWith({ name: "Tour 1" });
    });

    it("should return 404 if not found", async () => {
      Tour.findById.mockResolvedValue(null);
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await getTourById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle server error", async () => {
      Tour.findById.mockRejectedValue(new Error("DB error"));
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await getTourById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ================= UPDATE TOUR =================
  describe("updateTour", () => {
    it("should return 400 if guided_tour but hasGuide not true", async () => {
      const req = mockReq({ serviceType: "guided_tour", hasGuide: false }, { id: "t1" });
      const res = mockRes();
      await updateTour(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if tour not found", async () => {
      Tour.findByIdAndUpdate.mockResolvedValue(null);
      const req = mockReq({ name: "new" }, { id: "t1" });
      const res = mockRes();
      await updateTour(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update tour successfully", async () => {
      Tour.findByIdAndUpdate.mockResolvedValue({ name: "updated" });
      const req = mockReq({ name: "new" }, { id: "t1" });
      const res = mockRes();
      await updateTour(req, res);
      expect(res.json).toHaveBeenCalledWith({ name: "updated" });
    });

    it("should handle server error", async () => {
      Tour.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await updateTour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ================= DELETE TOUR =================
  describe("deleteTour", () => {
    it("should return 404 if not found", async () => {
      Tour.findById.mockResolvedValue(null);
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await deleteTour(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should deactivate tour successfully", async () => {
      const saveMock = jest.fn();
      Tour.findById.mockResolvedValue({ status: "active", save: saveMock });
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await deleteTour(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Tour deactivated successfully" });
    });

    it("should handle server error", async () => {
      Tour.findById.mockRejectedValue(new Error("DB error"));
      const req = mockReq({}, { id: "t1" });
      const res = mockRes();
      await deleteTour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
