const {
  createRoomService,
  updateRoomService,
  getRoomsByHotelIdService,
  getRoomDetailsService,
  deleteRoomService,
  updateRoomAvailabilityService,
  updateRoomPriceService
} = require("../src/services/roomService");

const roomRepository = require("../src/repositories/roomRepository");
const cloudinary = require("../src/config/cloudinary");

jest.mock("../src/repositories/roomRepository");
jest.mock("../src/config/cloudinary", () => ({
  uploader: { upload_stream: jest.fn() }
}));

describe("roomService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- createRoomService ----------
  describe("createRoomService", () => {
    it("should create room without files", async () => {
      roomRepository.createRoom.mockResolvedValue({ id: "r1" });

      const result = await createRoomService("h1", "o1", { roomType: "Deluxe", price: "100" }, []);

      expect(result.success).toBe(true);
      expect(roomRepository.createRoom).toHaveBeenCalledWith("h1", "o1", expect.objectContaining({
        roomType: "Deluxe",
        price: 100,
        images: []
      }));
    });

    it("should upload files and create room", async () => {
      const mockStream = jest.fn().mockReturnValue({ end: (b) => {} });
      cloudinary.uploader.upload_stream.mockImplementation((opts, cb) => {
        setImmediate(() => cb(null, { secure_url: "http://img.com/a.jpg" }));
        return { end: () => {} };
      });

      roomRepository.createRoom.mockResolvedValue({ id: "r2" });

      const files = [{ buffer: Buffer.from("file1") }];
      const result = await createRoomService("h1", "o1", { roomType: "Suite", price: "200" }, files);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: "r2" });
      expect(roomRepository.createRoom).toHaveBeenCalledWith("h1", "o1", expect.objectContaining({
        images: ["http://img.com/a.jpg"]
      }));
    });

    it("should throw error when image upload fails", async () => {
      cloudinary.uploader.upload_stream.mockImplementation((opts, cb) => {
        setImmediate(() => cb(new Error("Upload failed")));
        return { end: () => {} };
      });

      await expect(
        createRoomService("h1", "o1", { roomType: "Standard", price: "50" }, [{ buffer: Buffer.from("f") }])
      ).rejects.toThrow("Lỗi khi tải ảnh lên");
    });
  });

  // ---------- updateRoomService ----------
  describe("updateRoomService", () => {
    it("should update room with simple fields", async () => {
      roomRepository.updateRoom.mockResolvedValue({ id: "r3" });

      const result = await updateRoomService("h1", "r1", "o1", { price: "150", amenities: "wifi,tv" }, []);

      expect(result.success).toBe(true);
      expect(roomRepository.updateRoom).toHaveBeenCalledWith("h1", "r1", "o1", expect.objectContaining({
        price: 150,
        amenities: ["wifi", "tv"]
      }));
    });

    it("should update room with images", async () => {
      cloudinary.uploader.upload_stream.mockImplementation((opts, cb) => {
        setImmediate(() => cb(null, { secure_url: "http://img.com/new.jpg" }));
        return { end: () => {} };
      });

      roomRepository.updateRoom.mockResolvedValue({ id: "r4" });

      const result = await updateRoomService("h1", "r1", "o1", {}, [{ buffer: Buffer.from("f") }]);

      expect(result.success).toBe(true);
      expect(roomRepository.updateRoom).toHaveBeenCalledWith("h1", "r1", "o1", expect.objectContaining({
        images: ["http://img.com/new.jpg"]
      }));
    });

    it("should throw error when image upload fails", async () => {
      cloudinary.uploader.upload_stream.mockImplementation((opts, cb) => {
        setImmediate(() => cb(new Error("Upload failed")));
        return { end: () => {} };
      });

      await expect(
        updateRoomService("h1", "r1", "o1", {}, [{ buffer: Buffer.from("f") }])
      ).rejects.toThrow("Lỗi khi tải ảnh lên");
    });
  });

  // ---------- getRoomsByHotelIdService ----------
  it("should get rooms by hotelId", async () => {
    roomRepository.findRoomsByHotelId.mockResolvedValue([{ id: "r1" }]);

    const result = await getRoomsByHotelIdService("h1");

    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ id: "r1" }]);
  });

  // ---------- getRoomDetailsService ----------
  it("should get room details", async () => {
    roomRepository.findRoomById.mockResolvedValue({ id: "r1" });

    const result = await getRoomDetailsService("h1", "r1");

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: "r1" });
  });

  // ---------- deleteRoomService ----------
  it("should delete room", async () => {
    roomRepository.deleteRoom.mockResolvedValue();

    const result = await deleteRoomService("h1", "r1", "o1");

    expect(result.success).toBe(true);
    expect(result.message).toBe("Xóa phòng thành công");
  });

  // ---------- updateRoomAvailabilityService ----------
  it("should update room availability", async () => {
    roomRepository.updateRoomAvailability.mockResolvedValue({ id: "r5" });

    const result = await updateRoomAvailabilityService("h1", "r1", "o1", [{ date: "2025-09-01" }]);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: "r5" });
  });

  // ---------- updateRoomPriceService ----------
  it("should update room price", async () => {
    roomRepository.updateRoomPrice.mockResolvedValue({ id: "r6" });

    const result = await updateRoomPriceService("h1", "r1", "o1", "300");

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: "r6" });
    expect(roomRepository.updateRoomPrice).toHaveBeenCalledWith("h1", "r1", "o1", 300);
  });
});
