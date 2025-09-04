const transactionController = require("../src/controllers/transactionController");
const transactionService = require("../src/services/transactionService");

jest.mock("../src/services/transactionService");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("transactionController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- getTransactions --------
  it("should return transactions on success", async () => {
    const req = { user: { id: "u1" } };
    const res = mockRes();

    transactionService.getTransactionsService.mockResolvedValue({ success: true, data: [{ id: "t1" }] });

    await transactionController.getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: "t1" }] });
  });

  it("should handle error in getTransactions", async () => {
    const req = { user: { id: "u1" } };
    const res = mockRes();

    transactionService.getTransactionsService.mockRejectedValue(new Error("DB error"));

    await transactionController.getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "DB error" });
  });

  // -------- getBalance --------
  it("should return balance", async () => {
    const req = { user: { id: "u1" } };
    const res = mockRes();

    transactionService.getBalanceService.mockResolvedValue({ success: true, balance: 300 });

    await transactionController.getBalance(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, balance: 300 });
  });

  // -------- createPayout --------
  it("should create payout", async () => {
    const req = { user: { id: "u1" }, body: { amount: 100, method: "bank" } };
    const res = mockRes();

    transactionService.createPayoutService.mockResolvedValue({ success: true, data: { id: "p1" } });

    await transactionController.createPayout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: "p1" } });
  });

  // -------- getPayouts --------
  it("should get payouts", async () => {
    const req = { user: { id: "u1" } };
    const res = mockRes();

    transactionService.getPayoutsService.mockResolvedValue({ success: true, data: [{ id: "p1" }] });

    await transactionController.getPayouts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: "p1" }] });
  });

  // -------- updateBankDetails --------
  it("should update bank details", async () => {
    const req = { user: { id: "u1" }, body: { bankName: "VCB", accountNumber: "123" } };
    const res = mockRes();

    transactionService.updateBankDetailsService.mockResolvedValue({ success: true, data: { bankName: "VCB" } });

    await transactionController.updateBankDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { bankName: "VCB" } });
  });
});
