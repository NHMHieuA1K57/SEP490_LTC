const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Tạo booking mới
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
