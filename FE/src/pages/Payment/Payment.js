"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.scss";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      paymentMethod,
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      saveCard,
    });
    alert("Payment successful!");
    navigate("/bookings");
  };

  const handleAlternativePayment = () => {
    alert("Payment successful!");
    navigate("/bookings");
  };

  const booking = {
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
            <div className="payment-methods">
              <h3>Payment Method</h3>
              <div className="method-options">
                <label
                  className={`method-option ${
                    paymentMethod === "credit" ? "method-option--active" : ""
                  }`}
                  onClick={() => setPaymentMethod("credit")}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={paymentMethod === "credit"}
                    onChange={() => {}}
                  />
                  <div className="method-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div className="method-info">
                    <span className="method-name">Credit Card</span>
                    <span className="method-desc">Visa, Mastercard, Amex</span>
                  </div>
                </label>

                <label
                  className={`method-option ${
                    paymentMethod === "paypal" ? "method-option--active" : ""
                  }`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => {}}
                  />
                  <div className="method-icon method-icon--paypal">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.5 15.5h-4a.5.5 0 01-.5-.5l1-10a.5.5 0 01.5-.5h5.5c2.76 0 5 2.24 5 5 0 2.76-2.24 5-5 5h-2.5z" />
                      <path d="M6.5 19.5h-1a.5.5 0 01-.5-.5l.5-4a.5.5 0 01.5-.5h4.5c2.76 0 5 2.24 5 5 0 2.76-2.24 5-5 5h-2.5l-1.5-5z" />
                    </svg>
                  </div>
                  <div className="method-info">
                    <span className="method-name">PayPal</span>
                    <span className="method-desc">
                      Pay with your PayPal account
                    </span>
                  </div>
                </label>

                <label
                  className={`method-option ${
                    paymentMethod === "apple" ? "method-option--active" : ""
                  }`}
                  onClick={() => setPaymentMethod("apple")}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple"
                    checked={paymentMethod === "apple"}
                    onChange={() => {}}
                  />
                  <div className="method-icon method-icon--apple">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.44 4.44 0 00-3 1.52 4.17 4.17 0 00-1 3.09 3.69 3.69 0 002.94-1.42z" />
                      <path d="M17.46 8.6A4.76 4.76 0 0014 6.46a5.17 5.17 0 00-3.16 1.69c-1.54 1.37-2.54 3.89-2.54 6.21 0 4.14 3.4 7.14 3.4 7.14s.32.46 1 .46a2.87 2.87 0 001.53-.46c.53-.3 1.52-.51 2.14-.51s1.47.21 2 .51a2.87 2.87 0 001.53.46c.63 0 1-.46 1-.46s3.39-3 3.39-7.14a10.19 10.19 0 00-7.83-5.8z" />
                    </svg>
                  </div>
                  <div className="method-info">
                    <span className="method-name">Apple Pay</span>
                    <span className="method-desc">Pay with Apple Pay</span>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === "credit" && (
              <form className="credit-card-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <label className="save-card-option">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Save this card for future bookings
                </label>

                <button type="submit" className="btn btn-primary pay-btn">
                  Pay ${booking.total}
                </button>
              </form>
            )}

            {paymentMethod === "paypal" && (
              <div className="alternative-payment">
                <div className="alternative-payment__content">
                  <div className="alternative-payment__icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.5 15.5h-4a.5.5 0 01-.5-.5l1-10a.5.5 0 01.5-.5h5.5c2.76 0 5 2.24 5 5 0 2.76-2.24 5-5 5h-2.5z" />
                      <path d="M6.5 19.5h-1a.5.5 0 01-.5-.5l.5-4a.5.5 0 01.5-.5h4.5c2.76 0 5 2.24 5 5 0 2.76-2.24 5-5 5h-2.5l-1.5-5z" />
                    </svg>
                  </div>
                  <p>
                    You will be redirected to PayPal to complete your payment.
                  </p>
                  <button
                    onClick={handleAlternativePayment}
                    className="btn btn-primary pay-btn"
                  >
                    Continue to PayPal
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === "apple" && (
              <div className="alternative-payment">
                <div className="alternative-payment__content">
                  <div className="alternative-payment__icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.94 5.19A4.38 4.38 0 0016 2a4.44 4.44 0 00-3 1.52 4.17 4.17 0 00-1 3.09 3.69 3.69 0 002.94-1.42z" />
                      <path d="M17.46 8.6A4.76 4.76 0 0014 6.46a5.17 5.17 0 00-3.16 1.69c-1.54 1.37-2.54 3.89-2.54 6.21 0 4.14 3.4 7.14 3.4 7.14s.32.46 1 .46a2.87 2.87 0 001.53-.46c.53-.3 1.52-.51 2.14-.51s1.47.21 2 .51a2.87 2.87 0 001.53.46c.63 0 1-.46 1-.46s3.39-3 3.39-7.14a10.19 10.19 0 00-7.83-5.8z" />
                    </svg>
                  </div>
                  <p>
                    You will be redirected to Apple Pay to complete your
                    payment.
                  </p>
                  <button
                    onClick={handleAlternativePayment}
                    className="btn btn-primary pay-btn"
                  >
                    Continue to Apple Pay
                  </button>
                </div>
              </div>
            )}

            <div className="payment-security">
              <div className="security-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div className="security-info">
                <h4>Secure Payment</h4>
                <p>
                  Your payment information is encrypted and secure. We never
                  store your full card details.
                </p>
              </div>
            </div>
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
              <div className="price-row">
                <span>Taxes & fees</span>
                <span>${booking.taxes}</span>
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