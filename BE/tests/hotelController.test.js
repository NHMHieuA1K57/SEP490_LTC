const request = require("supertest");
const express = require("express");
const hotelService = require("../services/hotelService");
const hotelController = require("../controllers/hotelController");

jest.mock("../services/hotelService");

const app = express();
app.use(express.json());
app.post("/hotels", (req, res) => hotelController.createHotel(req, res));
app.get("/hotels", (req, res) => hotelController.getHotels(req, res));
app.get("/hotels/:id", (req, res) => hotelController.getHotel(req, res));
app.get("/hotels/:hotelId/details", (req, res) => hotelController.getHotelDetails(req, res));
app.put("/hotels/:id", (req, res) => hotelController.updateHotel(req, res));
app.delete("/hotels/:id", (req, res) => hotelController.deleteHotel(req, res));
app.get("/search", (req, res) => hotelController.searchHotelsController(req, res));
app.get("/all", (req, res) => hotelController.getAllHotels(req, res));

describe("Hotel Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create hotel success", async () => {
    hotelService.createHotelService.mockResolvedValue({ success: true });
    const res = await request(app).post("/hotels").send({});
    expect(res.status).toBe(201);
  });

  it("should handle error when creating hotel", async () => {
    hotelService.createHotelService.mockRejectedValue(new Error("Fail"));
    const res = await request(app).post("/hotels").send({});
    expect(res.status).toBe(400);
  });

  it("should get hotels success", async () => {
    hotelService.getHotelsService.mockResolvedValue({ success: true, data: [] });
    const res = await request(app).get("/hotels");
    expect(res.status).toBe(200);
  });

  it("should handle error when getting hotels", async () => {
    hotelService.getHotelsService.mockRejectedValue(new Error("Fail"));
    const res = await request(app).get("/hotels");
    expect(res.status).toBe(400);
  });

  it("should get hotel details success", async () => {
    hotelService.getHotelDetailsService.mockResolvedValue({ id: "h1" });
    const res = await request(app).get("/hotels/1/details");
    expect(res.status).toBe(200);
  });

  it("should handle error when getting hotel details", async () => {
    hotelService.getHotelDetailsService.mockRejectedValue(new Error("Bad filters"));
    const res = await request(app).get("/hotels/1/details");
    expect(res.status).toBe(400);
  });

  it("should update hotel success", async () => {
    hotelService.updateHotelService.mockResolvedValue({ success: true });
    const res = await request(app).put("/hotels/1").send({});
    expect(res.status).toBe(200);
  });

  it("should delete hotel success", async () => {
    hotelService.deleteHotelService.mockResolvedValue({ success: true });
    const res = await request(app).delete("/hotels/1");
    expect(res.status).toBe(200);
  });

  it("should search hotels success", async () => {
    hotelService.searchHotelsService.mockResolvedValue({ success: true });
    const res = await request(app).get("/search");
    expect(res.status).toBe(200);
  });

  it("should handle error in search hotels", async () => {
    hotelService.searchHotelsService.mockRejectedValue(new Error("Lỗi hệ thống khi tìm kiếm khách sạn"));
    const res = await request(app).get("/search");
    expect([400, 500]).toContain(res.status);
  });

  it("should get all hotels success", async () => {
    hotelService.getAllHotelsService.mockResolvedValue({ success: true });
    const res = await request(app).get("/all");
    expect(res.status).toBe(200);
  });
});
