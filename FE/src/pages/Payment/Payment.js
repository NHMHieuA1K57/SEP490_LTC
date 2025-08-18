"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.scss";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;

  if (!booking) {
    return <div>Không có dữ liệu đặt phòng.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Payment successful!");
    navigate("/bookings");
  };

  const handleAlternativePayment = () => {
    alert("Payment successful!");
    navigate("/bookings");
  };

  const bookings = {
    hotel: "The Grand Resort",
    room: "Deluxe King Room",
    checkIn: "Sep 23, 2025",
    checkOut: "Sep 26, 2025",
    guests: 2,
    nights: 3,
    roomPrice: 100,
    taxes: 36,
    total: 336,
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="page-header">
          <h1>Payment</h1>
          <p>Complete your booking by providing payment details</p>
        </div>

        <div className="payment-container">
          <div className="payment-form-container">
            {paymentMethod === "credit" && (
              <form className="credit-card-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+84 912 345 678"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary pay-btn">
                  Pay ${booking.total}
                </button>
              </form>
            )}
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="hotel-info">
              <div className="hotel-info__image">
                <img
                  src="/placeholder.svg?height=100&width=100&text=Grand+Resort"
                  alt={booking.hotel}
                />
              </div>
              <div className="hotel-info__details">
                <h4>{booking.hotel}</h4>
                <p>{booking.room}</p>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <span>Check-in</span>
                <span>{booking.checkIn}</span>
              </div>
              <div className="detail-row">
                <span>Check-out</span>
                <span>{booking.checkOut}</span>
              </div>
              <div className="detail-row">
                <span>Guests</span>
                <span>{booking.guests}</span>
              </div>
              <div className="detail-row">
                <span>Room</span>
                <span>{booking.room}</span>
              </div>
            </div>

            <div className="price-details">
              <div className="price-row">
                <span>
                  ${booking.roomPrice} x {booking.nights} nights
                </span>
                <span>${booking.roomPrice * booking.nights}</span>
              </div>

              <div className="price-row price-row--total">
                <span>Total</span>
                <span>${booking.total}</span>
              </div>
            </div>

            <div className="cancellation-policy">
              <h4>Cancellation Policy</h4>
              <p>
                Free cancellation until September 20, 2025. After that, you will
                be charged the full amount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
