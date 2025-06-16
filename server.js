require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const httpErrors = require("http-errors");
const db = require("./config/db");
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const BusinessUserRoutes = require('./routes/businessUserRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev")); 
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Thêm middleware debug để kiểm tra body
// app.use((req, res, next) => {
//     console.log('Received body:', req.body);
//     next();
// });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-user', BusinessUserRoutes);
app.use('/api/admin', adminRoutes);

const tourRoutes = require('./routes/tourRoutes');
app.use('/api/tours', tourRoutes); 

app.get('/', (req, res) => {
    res.status(200).json({
        message: "oke"
    });
});

// Middleware xử lý 404 Not Found
app.use(async (req, res, next) => {
    next(httpErrors.NotFound());
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error('Error:', err); // Log lỗi để debug
    res.status(err.status || 500).json({
        success: false,
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

// Kết nối database
db.connectDB().catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Thoát nếu kết nối thất bại
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
