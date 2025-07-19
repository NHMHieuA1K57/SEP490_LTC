require("dotenv").config();
const db = require("../config/db");
const mongoose = require("mongoose");

const hotels = [
  {
    name: "Sunshine Resort",
    description: "A beautiful resort with sea view and modern amenities.",
    address: "123 Beach Road, Da Nang, Vietnam",
    location: {
      type: "Point",
      coordinates: [108.223, 16.067],
    },
    ownerId: new mongoose.Types.ObjectId(),
    images: [
      "https://example.com/images/sunshine1.jpg",
      "https://example.com/images/sunshine2.jpg",
    ],
    amenities: ["pool", "wifi", "spa", "restaurant"],
    rooms: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    rating: 4.5,
    status: "active",
    additionalInfo: {
      policies: {
        cancellation: "Free cancellation within 24 hours.",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        depositRequired: true,
      },
      category: "resort",
      contact: {
        phone: "+84 123 456 789",
        email: "info@sunshineresort.com",
      },
      payoutPolicy: "monthly",
    },
  },
  {
    name: "City Center Hotel",
    description: "Conveniently located in the heart of the city.",
    address: "456 Main Street, Ho Chi Minh City, Vietnam",
    location: {
      type: "Point",
      coordinates: [106.7, 10.776],
    },
    ownerId: new mongoose.Types.ObjectId(),
    images: ["https://example.com/images/citycenter1.jpg"],
    amenities: ["wifi", "parking", "gym"],
    rooms: [new mongoose.Types.ObjectId()],
    rating: 4.0,
    status: "pending",
    additionalInfo: {
      policies: {
        cancellation: "Non-refundable.",
        checkInTime: "13:00",
        checkOutTime: "11:00",
        depositRequired: false,
      },
      category: "hotel",
      contact: {
        phone: "+84 987 654 321",
        email: "contact@citycenterhotel.com",
      },
      payoutPolicy: "weekly",
    },
  },
  {
    name: "Green Homestay",
    description: "A cozy homestay surrounded by nature.",
    address: "789 Mountain Road, Da Lat, Vietnam",
    location: {
      type: "Point",
      coordinates: [108.441, 11.94],
    },
    ownerId: new mongoose.Types.ObjectId(),
    images: ["https://example.com/images/greenhomestay1.jpg"],
    amenities: ["garden", "breakfast", "wifi"],
    rooms: [],
    rating: 5.0,
    status: "active",
    additionalInfo: {
      policies: {
        cancellation: "Cancel up to 7 days before check-in for a full refund.",
        checkInTime: "15:00",
        checkOutTime: "10:00",
        depositRequired: false,
      },
      category: "homestay",
      contact: {
        phone: "+84 555 666 777",
        email: "hello@greenhomestay.com",
      },
      payoutPolicy: "biweekly",
    },
  },
];

async function seedHotels() {
  await db.connectDB();
  try {
    await db.Hotel.deleteMany({});
    await db.Hotel.insertMany(hotels);
    console.log("Seeded hotel data successfully!");
  } catch (err) {
    console.error("Error seeding hotel data:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedHotels();
