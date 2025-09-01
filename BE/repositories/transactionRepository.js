// repositories/transactionRepository.js
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Tour = require('../models/Tour');

/* Helpers */
function buildDateFilter(startDate, endDate) {
  if (!startDate && !endDate) return undefined;
  const f = {};
  if (startDate) f.$gte = new Date(startDate);
  if (endDate)   f.$lte = new Date(endDate);
  return f;
}

class TransactionRepository {
  /** Lịch sử giao dịch theo businessUserId (hotel_owner/tour_provider) */
  async findTransactionsByBusinessUserId(businessUserId, filters = {}) {
    const { startDate, endDate, status, type } = filters;
    const query = { 'details.businessUserId': businessUserId };
    if (status) query.status = status;
    if (type)   query.type = type;
    const dateFilter = buildDateFilter(startDate, endDate);
    if (dateFilter) query.createdAt = dateFilter;

    return Transaction.find(query)
      .select('bookingId tourBookingId amount type method status transactionId createdAt details')
      .populate('bookingId',     'totalPrice type hotelId tourId paymentInfo')
      .populate('tourBookingId', 'totalPrice tourId customerId status')
      .sort({ createdAt: -1 })
      .lean();
  }

  /** Số dư khả dụng = tổng amount của transactions đã completed */
  async getBalanceByBusinessUserId(businessUserId) {
    const agg = await Transaction.aggregate([
      { $match: { 'details.businessUserId': businessUserId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return agg[0]?.total || 0;
  }

  /** Tạo yêu cầu rút tiền (ghi bút toán payout âm, pending) */
  async createPayoutRequest(businessUserId, amount, method) {
    // xác thực đối tác + thông tin ngân hàng (nếu rút qua bank)
    const user = await User.findOne({
      _id: businessUserId,
      role: { $in: ['hotel_owner', 'tour_provider'] }
    }).lean();
    if (!user) throw new Error('Người dùng không tồn tại hoặc không phải đối tác kinh doanh');
    if (method === 'bank_transfer' && !user?.businessInfo?.bankDetails?.accountNumber) {
      throw new Error('Thông tin ngân hàng chưa được cung cấp');
    }

    // kiểm tra số dư khả dụng
    const balance = await this.getBalanceByBusinessUserId(businessUserId);
    if (amount <= 0) throw new Error('Số tiền rút phải lớn hơn 0');
    if (amount > balance) throw new Error('Số dư không đủ để rút');

    // lấy payoutPolicy theo loại đối tác
    let payoutPolicy = 'monthly';
    if (user.role === 'hotel_owner') {
      const hotel = await Hotel.findOne({ ownerId: businessUserId })
        .select('additionalInfo.payoutPolicy').lean();
      payoutPolicy = hotel?.additionalInfo?.payoutPolicy || payoutPolicy;
    } else if (user.role === 'tour_provider') {
      const tour = await Tour.findOne({ providerId: businessUserId })
        .select('additionalInfo.payoutPolicy').lean();
      payoutPolicy = tour?.additionalInfo?.payoutPolicy || payoutPolicy;
    }

    // ghi bút toán payout (tiền ra → âm)
    const tx = await Transaction.create({
      userId: businessUserId,
      type: 'payout',
      direction: 'out',
      amount: -Math.abs(amount),
      method,
      status: 'pending',
      transactionId: `PO_${Date.now()}_${businessUserId.toString()}`,
      details: { businessUserId, commission: 0, payoutPolicy }
    });

    return {
      payoutId: tx._id,
      amount,
      status: tx.status,
      createdAt: tx.createdAt,
      payoutPolicy
    };
  }

  async findPayoutsByBusinessUserId(businessUserId) {
    return Transaction.find({ 'details.businessUserId': businessUserId, type: 'payout' })
      .select('amount method status transactionId createdAt details.completedAt')
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateBankDetails(businessUserId, bankDetails) {
    const user = await User.findOneAndUpdate(
      { _id: businessUserId, role: { $in: ['hotel_owner', 'tour_provider'] } },
      { $set: { 'businessInfo.bankDetails': bankDetails } },
      { new: true, runValidators: true }
    ).select('businessInfo.bankDetails');

    if (!user) throw new Error('Người dùng không tồn tại hoặc không phải đối tác kinh doanh');
    return user.businessInfo.bankDetails;
  }
}

module.exports = new TransactionRepository();
