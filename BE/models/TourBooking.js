const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, default: "pending" },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TourBooking", bookingSchema);
// This code defines a Mongoose schema for a tour booking system. It includes fields for the tour ID, customer ID, quantity of tickets booked, status of the booking, and the date when the booking was made. The schema is then exported as a Mongoose model named "TourBooking". This model can be used to interact with the bookings collection in a MongoDB database.
// The tourId and customerId fields are references to the Tour and User models, respectively, allowing for easy association between bookings, tours, and users. 