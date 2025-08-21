"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.scss";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <div>Không có dữ liệu đặt phòng.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    navigate("/qr", { state: { booking } });
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="page-header">
          <h1>Thanh toán</h1>
          <p>Hoàn tất đặt phòng của bạn bằng cách điền thông tin thanh toán</p>
        </div>

        <div className="payment-container">
          <div className="payment-form-container">
            {paymentMethod === "credit" && (
              <form className="credit-card-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
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
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+84 912 345 678"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary pay-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Đang xử lý..."
                    : `Thanh toán ${booking.total} VND`}
                </button>
              </form>
            )}
          </div>

          <div className="booking-summary">
            <h3>Thông tin đặt phòng</h3>
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
                <span>Ngày nhận phòng</span>
                <span>{booking.checkIn}</span>
              </div>
              <div className="detail-row">
                <span>Ngày trả phòng</span>
                <span>{booking.checkOut}</span>
              </div>
              <div className="detail-row">
                <span>Số khách</span>
                <span>{booking.guests}</span>
              </div>
              <div className="detail-row">
                <span>Loại phòng</span>
                <span>{booking.room}</span>
              </div>
            </div>

            <div className="price-details">
              <div className="price-row">
                <span>
                  {booking.roomPrice} VND x {booking.nights} đêm
                </span>
                <span>{booking.roomPrice * booking.nights} VND</span>
              </div>

              <div className="price-row price-row--total">
                <span>Tổng cộng</span>
                <span>{booking.total} VND</span>
              </div>
            </div>

            <div className="cancellation-policy">
              <h4>Chính sách hủy phòng</h4>
              <p>
                Miễn phí hủy phòng đến ngày 20/09/2025. Sau thời gian này bạn sẽ
                bị tính toàn bộ chi phí đặt phòng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
