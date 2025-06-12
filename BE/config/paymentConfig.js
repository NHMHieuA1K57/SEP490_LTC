module.exports = {
  vnpTmnCode: 'HKY9TJN7',
  vnpHashSecret: process.env.VNPAY_HASH_SECRET || '882QTU8SCA8JK4VOX48W6HT069EGS9C4',
  vnpUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnpReturnUrl: 'http://localhost:9999/api/bookings/vnpay-callback', 
  vnpApiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
};