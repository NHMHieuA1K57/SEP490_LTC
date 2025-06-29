require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.User = require('../models/User');
db.Hotel = require('../models/Hotel');
db.Tour = require('../models/Tour');
db.Booking = require('../models/Booking');
db.Review = require('../models/Review');
db.Message = require('../models/Message');
db.Promotion = require('../models/Promotion');
db.Transcation = require('../models/Transaction');
db.Notification = require('../models/Notification');
db.Report = require('../models/Report');
db.LoyaltyPoints = require('../models/LoyaltyPoints');
db.SystemSettings = require('../models/SystemSettings');
db.Wallet = require('../models/Wallet');
db.Payment = require('../models/Payment');

db.connectDB = async () => {
   await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME 
    })
    .then(() => console.log("connect to MongoDB success"))
    .catch(error => console.error(error.message));
};

module.exports = db;