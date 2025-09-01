import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QRPage.scss";

const QRPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [qrUrl, setQrUrl] = useState(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    navigate("/bookings");
  };

  useEffect(() => {
    if (booking) {
      createQR();
    }
  }, [booking]);

  const createQR = async () => {
    try {
      const response = await fetch("http://localhost:9999/create-vietqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: booking.total,
          courseName: booking.hotel, // hoặc "Booking Hotel"
        }),
      });

      if (!response.ok) throw new Error("Lỗi khi tạo QR");

      const data = await response.json();
      setQrUrl(data.qrUrl);

      // checkTransactionStatus(data.transactionId);
    } catch (error) {
      console.error("Lỗi tạo QR:", error);
    }
  };

  // const checkTransactionStatus = (transactionId) => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:9999/check-transaction-status/${transactionId}`
  //       );
  //       const data = await res.json();
  //       setStatus(data.status);

  //       if (data.status === "success") {
  //         clearInterval(interval);
  //         navigate("/bookings", { state: { booking } });
  //       }
  //     } catch (err) {
  //       console.error("Lỗi khi kiểm tra trạng thái:", err);
  //     }
  //   }, 3000);
  // };

  if (!booking) {
    return <div>Không có dữ liệu booking.</div>;
  }

  const handleBooking = async () => {
    const bookingData = {
      fullName: "Nguyễn Văn A",
      email: "example@email.com",
      phone: "+84 912 345 678",
      amount: 200,
      roomType: "Nhà trệt (Bungalow)",
      checkIn: "2025-08-28",
      checkOut: "2025-08-29",
      guests: 2,
      totalPrice: 200,
    };

    try {
      const res = await fetch("http://localhost:9999/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      console.log("Booking created:", data);
      navigate("/bookings");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="qr-page">
      <h1>Quét mã QR để thanh toán</h1>
      {qrUrl ? <img src={qrUrl} alt="QR Code" /> : <p>Đang tạo mã QR...</p>}
      <button className="paid-btn" onClick={handleBooking} disabled={loading}>
        Tôi đã thanh toán
      </button>
    </div>
  );
};

export default QRPage;
