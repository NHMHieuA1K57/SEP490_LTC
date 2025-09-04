const hotelRepository = require("../repositories/hotelRepository");
const cloudinary = require("../config/cloudinary");
const hotelService = require("../services/hotelService");

jest.mock("../repositories/hotelRepository");
jest.mock("../config/cloudinary", () => ({
  uploader: { upload_stream: jest.fn() },
}));

describe("Hotel Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createHotelService", () => {
    it("should create hotel without images", async () => {
      hotelRepository.createHotel.mockResolvedValue({ _id: "1", name: "Hotel A" });

      const result = await hotelService.createHotelService("owner1", { name: "Hotel A" }, []);
      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Hotel A");
      expect(hotelRepository.createHotel).toHaveBeenCalled();
    });

    it("should upload images and create hotel", async () => {
      const mockEnd = jest.fn();
      cloudinary.uploader.upload_stream.mockImplementation((opts, cb) => {
        setImmediate(() => cb(null, { secure_url: "http://img.com/1.jpg" }));
        return { end: mockEnd };
      });

      hotelRepository.createHotel.mockResolvedValue({ _id: "2", images: ["http://img.com/1.jpg"] });

      const result = await hotelService.createHotelService("owner1", { name: "Hotel B" }, [{ buffer: Buffer.from("x") }]);
      expect(result.data.images).toContain("http://img.com/1.jpg");
    });

    it("should throw error if image upload fails", async () => {
      cloudinary.uploader.upload_stream.mockImplementation((opts, cb) => {
        setImmediate(() => cb(new Error("Upload failed")));
        return { end: jest.fn() };
      });

      await expect(
        hotelService.createHotelService("owner1", { name: "Hotel C" }, [{ buffer: Buffer.from("x") }])
      ).rejects.toThrow("Lỗi khi tải ảnh lên");
    });
  });

  describe("getHotelsService", () => {
    it("should return hotels by owner", async () => {
      hotelRepository.findHotelsByOwnerId.mockResolvedValue([{ name: "H1" }]);
      const result = await hotelService.getHotelsService("owner1");
      expect(result.data).toHaveLength(1);
    });
  });

  describe("getHotelService", () => {
    it("should return hotel if found", async () => {
      hotelRepository.findHotelById.mockResolvedValue({ name: "H2" });
      const result = await hotelService.getHotelService("h1", "owner1");
      expect(result.data.name).toBe("H2");
    });

    it("should throw error if not found", async () => {
      hotelRepository.findHotelById.mockResolvedValue(null);
      await expect(hotelService.getHotelService("h1", "owner1")).rejects.toThrow("Khách sạn không tồn tại");
    });
  });

  describe("getHotelDetailsService", () => {
    it("should return details if valid filters", async () => {
      hotelRepository.getHotelDetails.mockResolvedValue({ id: "h1" });
      const result = await hotelService.getHotelDetailsService("h1", { checkInDate: "2025-09-01", checkOutDate: "2025-09-03" });
      expect(result.id).toBe("h1");
    });

    it("should throw error if invalid date", async () => {
      await expect(
        hotelService.getHotelDetailsService("h1", { checkInDate: "bad-date", checkOutDate: "2025-09-03" })
      ).rejects.toThrow("Ngày check-in hoặc check-out không hợp lệ");
    });

    it("should throw error if checkIn >= checkOut", async () => {
      await expect(
        hotelService.getHotelDetailsService("h1", { checkInDate: "2025-09-10", checkOutDate: "2025-09-05" })
      ).rejects.toThrow("Ngày check-in phải trước ngày check-out");
    });

    it("should throw error if numberOfPeople <= 0", async () => {
      await expect(
        hotelService.getHotelDetailsService("h1", { numberOfPeople: 0 })
      ).rejects.toThrow("Số lượng người phải lớn hơn 0");
    });
  });

  describe("updateHotelService", () => {
    it("should update hotel successfully", async () => {
      hotelRepository.updateHotel.mockResolvedValue({ name: "Updated H" });
      const result = await hotelService.updateHotelService("h1", "owner1", { name: "Updated H" }, []);
      expect(result.data.name).toBe("Updated H");
    });

    it("should throw if hotel not found", async () => {
      hotelRepository.updateHotel.mockResolvedValue(null);
      await expect(hotelService.updateHotelService("h1", "owner1", { name: "Updated" }, []))
        .rejects.toThrow("Khách sạn không tồn tại");
    });
  });

  describe("deleteHotelService", () => {
    it("should delete hotel", async () => {
      hotelRepository.deleteHotel.mockResolvedValue({ id: "h1" });
      const result = await hotelService.deleteHotelService("h1", "owner1");
      expect(result.success).toBe(true);
    });

    it("should throw if hotel not found", async () => {
      hotelRepository.deleteHotel.mockResolvedValue(null);
      await expect(hotelService.deleteHotelService("h1", "owner1"))
        .rejects.toThrow("Khách sạn không tồn tại");
    });
  });

  describe("searchHotelsService", () => {
    it("should return no hotels found message", async () => {
      hotelRepository.searchHotelsBasic.mockResolvedValue([]);
      const result = await hotelService.searchHotelsService({});
      expect(result.data).toEqual([]);
    });

    it("should return formatted hotel list", async () => {
      hotelRepository.searchHotelsBasic.mockResolvedValue([
        { hotel: { _id: "h1", name: "H1", address: "A1", images: [], rating: 5, reviewCount: 10 }, rooms: [{ price: 100 }, { price: 80 }] }
      ]);
      const result = await hotelService.searchHotelsService({});
      expect(result.data[0].priceFrom).toBe(80);
    });
  });

  describe("getAllHotelsService", () => {
    it("should return all hotels", async () => {
      hotelRepository.getAllHotels.mockResolvedValue([{ _id: "h1", name: "H1", address: "A1" }]);
      const result = await hotelService.getAllHotelsService();
      expect(result.data[0].name).toBe("H1");
    });

    it("should throw error if repo fails", async () => {
      hotelRepository.getAllHotels.mockRejectedValue(new Error("DB error"));
      await expect(hotelService.getAllHotelsService()).rejects.toThrow("Lỗi khi lấy danh sách khách sạn");
    });
  });
});
