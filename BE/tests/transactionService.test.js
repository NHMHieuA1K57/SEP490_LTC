const transactionService = require("../src/services/transactionService");
const transactionRepository = require("../src/repositories/transactionRepository");

jest.mock("../src/repositories/transactionRepository");

describe("transactionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- getTransactionsService --------
  it("should return transactions list", async () => {
    transactionRepository.getTransactions.mockResolvedValue([{ id: "t1" }]);

    const result = await transactionService.getTransactionsService("u1");

    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ id: "t1" }]);
  });

  // -------- getBalanceService --------
  it("should return user balance", async () => {
    transactionRepository.getBalance.mockResolvedValue(500);

    const result = await transactionService.getBalanceService("u1");

    expect(result.success).toBe(true);
    expect(result.balance).toBe(500);
  });

  // -------- createPayoutService --------
  describe("createPayoutService", () => {
    it("should throw error if amount <= 0", async () => {
      await expect(
        transactionService.createPayoutService("u1", { amount: -10, method: "bank" })
      ).rejects.toThrow("Số tiền rút phải lớn hơn 0");
    });

    it("should throw error if method invalid", async () => {
      await expect(
        transactionService.createPayoutService("u1", { amount: 100, method: "invalid" })
      ).rejects.toThrow("Phương thức rút tiền không hợp lệ");
    });

    it("should create payout successfully", async () => {
      transactionRepository.createPayoutRequest.mockResolvedValue({ id: "p1" });

      const result = await transactionService.createPayoutService("u1", {
        amount: 200,
        method: "bank",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: "p1" });
    });
  });

  // -------- getPayoutsService --------
  it("should return payout list", async () => {
    transactionRepository.getPayouts.mockResolvedValue([{ id: "p1" }]);

    const result = await transactionService.getPayoutsService("u1");

    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ id: "p1" }]);
  });

  // -------- updateBankDetailsService --------
  describe("updateBankDetailsService", () => {
    it("should throw error if missing bankName", async () => {
      await expect(
        transactionService.updateBankDetailsService("u1", { accountNumber: "123" })
      ).rejects.toThrow("Thông tin ngân hàng không đầy đủ");
    });

    it("should update successfully", async () => {
      transactionRepository.updateBankDetails.mockResolvedValue({ bankName: "VCB" });

      const result = await transactionService.updateBankDetailsService("u1", {
        bankName: "VCB",
        accountNumber: "123",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ bankName: "VCB" });
    });
  });
});
