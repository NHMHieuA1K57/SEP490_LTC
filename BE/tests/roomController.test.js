const roomController = require("../src/controllers/roomController");
const roomService = require("../src/services/roomService");

jest.mock("../src/services/roomService");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("roomController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- createRoom --------
  it("should create room successfully", async () => {
    const req = { params: { hotelId: "h1" }, user: { _id: "u1" }, body: { roomType: "Deluxe" }, files: [] };
    const res = mockRes();

    roomService.createRoomService.mockResolvedValue({ success: true, data: { id: "r1" } });

    await roomController.createRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "r1" } });
  });

  it("should handle error in createRoom", async () => {
    const req = { params: { hotelId: "h1" }, user: { _id: "u1" }, body: {}, files: [] };
    const res = mockRes();

    roomService.createRoomService.mockRejectedValue(new Error("DB error"));

    await roomController.createRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "DB error" });
  });

  // -------- updateRoom --------
  it("should update room successfully", async () => {
    const req = { params: { hotelId: "h1", roomId: "r1" }, user: { _id: "u1" }, body: { price: 100 }, files: [] };
    const res = mockRes();

    roomService.updateRoomService.mockResolvedValue({ success: true, data: { id: "r1" } });

    await roomController.updateRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "r1" } });
  });

  // -------- getRooms --------
  it("should get rooms list", async () => {
    const req = { params: { hotelId: "h1" } };
    const res = mockRes();

    roomService.getRoomsByHotelIdService.mockResolvedValue({ success: true, data: [{ id: "r1" }] });

    await roomController.getRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: "r1" }] });
  });

  // -------- getRoomDetails --------
  it("should get room details", async () => {
    const req = { params: { hotelId: "h1", roomId: "r1" } };
    const res = mockRes();

    roomService.getRoomDetailsService.mockResolvedValue({ success: true, data: { id: "r1" } });

    await roomController.getRoomDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "r1" } });
  });

  // -------- deleteRoom --------
  it("should delete room", async () => {
    const req = { query: { hotelId: "h1" }, params: { id: "r1" }, user: { _id: "u1" } };
    const res = mockRes();

    roomService.deleteRoomService.mockResolvedValue({ success: true, message: "Xóa phòng thành công" });

    await roomController.deleteRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Xóa phòng thành công" });
  });

  // -------- updateRoomAvailability --------
  it("should update room availability", async () => {
    const req = { params: { hotelId: "h1", roomId: "r1" }, user: { _id: "u1" }, body: { availability: [{ date: "2025-09-01", available: true }] } };
    const res = mockRes();

    roomService.updateRoomAvailabilityService.mockResolvedValue({ success: true, data: { id: "r1" } });

    await roomController.updateRoomAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "r1" } });
  });

  // -------- updateRoomPrice --------
  it("should update room price", async () => {
    const req = { params: { hotelId: "h1", roomId: "r1" }, user: { _id: "u1" }, body: { price: 150 } };
    const res = mockRes();

    roomService.updateRoomPriceService.mockResolvedValue({ success: true, data: { id: "r1" } });

    await roomController.updateRoomPrice(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "r1" } });
  });
});
