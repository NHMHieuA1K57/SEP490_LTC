// ===== Env & Core =====
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const httpErrors = require('http-errors');
const db = require('./config/db');
const session = require('express-session');

// HTTP & Socket.IO
const http = require('http');
const { Server } = require('socket.io');

// ===== QR & Payment helpers  =====
const axios = require('axios');
const crypto = require('crypto');
const config2 = require('./config/config');

// ===== Routes =====
const authRoutes = require('./routes/authRoutes');
const BusinessUserRoutes = require('./routes/businessUserRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const transactionRoutes = require('./routes/businessUserRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const bookingTourRoutes = require('./routes/bookingTourRoutes');  
const paymentRoutes = require('./routes/paymentRoutes');
const tourRoutes = require('./routes/tourRoutes');                
const reviewRoutes = require('./routes/reviewRoutes');            
const notificationRoutes = require('./routes/notificationRoutes');
const { attachNotifyNamespace } = require('./sockets/notify');    

const app = express();

// ===== Middleware chung =====
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

// ===== Session =====
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// ======= QR (VietQR) + Casso check  =======
let transactions = {}; // Lưu trữ trạng thái giao dịch trong bộ nhớ

const generateTransactionId = () => {
  return crypto.randomBytes(4).toString('hex').substring(0, 7);
};

// Tạo ảnh VietQR kèm mã giao dịch
app.post('/create-vietqr', (req, res) => {
  const { amount = 10000, courseName } = req.body;
  const transactionId = generateTransactionId();

  const qrUrl = `https://img.vietqr.io/image/${config2.bankInfo.bankId}-${config2.bankInfo.bankAccount}-${config2.bankInfo.template}.png?amount=${amount}&addInfo=${encodeURIComponent(
    courseName + ' Ma giao dich ' + transactionId
  )}&accountName=${encodeURIComponent(config2.bankInfo.accountName)}`;

  transactions[transactionId] = { status: 'pending', amount, courseName };
  res.json({ qrUrl, transactionId });
});

// Kiểm tra trạng thái giao dịch qua Casso
app.get('/check-transaction-status/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactions[transactionId];

  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

  try {
    const response = await axios.get(`${config2.casso.apiUrl}/transactions`, {
      headers: {
        Authorization: `Apikey ${config2.casso.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const transactionsData = response.data?.data?.records || [];
    const updatedTransaction = transactionsData.find((t) =>
      String(t.description || '').includes(transactionId)
    );

    if (updatedTransaction) {
      transactions[transactionId].status = 'success';
      return res.json({ status: 'success', transaction: updatedTransaction });
    }
    return res.json({ status: 'pending' });
  } catch (error) {
    console.error(
      'Error checking transaction status:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Error checking transaction status' });
  }
});

// ======= Routes  =======
app.use('/api/auth', authRoutes);
app.use('/api/business-user', BusinessUserRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hotel', hotelRoutes);

app.use('/api/tours', tourRoutes);
app.use('/api/tour-bookings', bookingTourRoutes);
app.use('/api', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/transaction', transactionRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
//app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'oke' });
});

// Kết quả thanh toán (giữ nguyên)
app.get('/payment-result', (req, res) => {
  const status = req.query.status;
  res.send(`
    <html>
      <body>
        <h2>Thanh toán ${status === 'success' ? 'THÀNH CÔNG ' : 'THẤT BẠI '}</h2>
      </body>
    </html>
  `);
});

// ======= 404 & Error handler =======
app.use(async (req, res, next) => {
  next(httpErrors.NotFound());
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: { status: err.status || 500, message: err.message },
  });
});

// ======= DB connect =======
db.connectDB().catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// ======= HTTP Server + Socket.IO =======
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

attachNotifyNamespace(io);

// cho phép truy cập io trong service/controller qua req.app.get('io')
app.set('io', io);

// CHỈ dùng server.listen (không dùng app.listen)
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
