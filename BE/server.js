require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const httpErrors = require("http-errors");
const db = require("./config/db");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const BusinessUserRoutes = require("./routes/businessUserRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const transactionRoutes = require("./routes/businessUserRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const tourRoutes = require("./routes/tourRoutes");
const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto"); // Import crypto library
const config2 = require("./config/config");
const app = express();
// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

//qr
let transactions = {}; // Lưu trữ trạng thái giao dịch

const generateTransactionId = () => {
  return crypto.randomBytes(4).toString("hex").substring(0, 7);
};

// Endpoint để tạo VietQR
app.post("/create-vietqr", (req, res) => {
  const { amount = 10000, courseName } = req.body;
  const transactionId = generateTransactionId();

  const qrUrl = `https://img.vietqr.io/image/${config2.bankInfo.bankId}-${
    config2.bankInfo.bankAccount
  }-${
    config2.bankInfo.template
  }.png?amount=${amount}&addInfo=${encodeURIComponent(
    courseName + " Ma giao dich " + transactionId
  )}&accountName=${encodeURIComponent(config2.bankInfo.accountName)}`;
  transactions[transactionId] = { status: "pending", amount, courseName };

  res.json({ qrUrl, transactionId });
});

app.get("/check-transaction-status/:transactionId", async (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactions[transactionId];

  if (transaction) {
    try {
      const response = await axios.get(`${config2.casso.apiUrl}/transactions`, {
        headers: {
          Authorization: `Apikey ${config2.casso.apiKey}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data.records);
      const transactionsData = response.data.data.records;
      const updatedTransaction = transactionsData.find((t) =>
        t.description.includes(transactionId)
      );
      if (updatedTransaction) {
        // Giả sử nếu tìm thấy, cập nhật trạng thái thành 'success'
        transactions[transactionId].status = "success";
        res.json({ status: "success", transaction: updatedTransaction });
      } else {
        res.json({ status: "pending" });
      }
    } catch (error) {
      console.error(
        "Error checking transaction status:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ error: "Error checking transaction status" });
    }
  } else {
    res.status(404).json({ error: "Transaction not found" });
  }
});

//qr

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Thêm middleware debug để kiểm tra body
// app.use((req, res, next) => {
//     console.log('Received body:', req.body);
//     next();
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/business-user", BusinessUserRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/tour", tourRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "oke",
  });
});
// Payment
app.use("/api/payments", paymentRoutes);
app.get("/payment-result", (req, res) => {
  const status = req.query.status;
  res.send(`
        <html>
        <body>
            <h2>Thanh toán ${
              status === "success" ? "THÀNH CÔNG " : "THẤT BẠI "
            }</h2>
        </body>
        </html>
    `);
});

// Middleware xử lý 404 Not Found
app.use(async (req, res, next) => {
  next(httpErrors.NotFound());
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("Error:", err); // Log lỗi để debug
  res.status(err.status || 500).json({
    success: false,
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Kết nối database
db.connectDB().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1); // Thoát nếu kết nối thất bại
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
