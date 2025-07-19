"use client";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHotelById } from "../../server/hotelAPI";
import "./HotelDetail.scss";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu có dữ liệu truyền qua state thì dùng luôn
    if (location.state && location.state.hotel) {
      setHotel(location.state.hotel);
      setLoading(false);
    } else {
      // Nếu không có thì fetch từ API
      fetchHotelById(id)
        .then((data) => {
          if (!data) {
            setError("Không thể tải chi tiết khách sạn.");
          } else {
            setHotel(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Không thể tải chi tiết khách sạn.");
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [id, location.state]);

  const handleBookNow = () => {
    navigate("/payment");
  };

  if (loading)
    return (
      <div className="hotel-detail">
        <div className="container">
          <div>Đang tải chi tiết khách sạn...</div>
        </div>
      </div>
    );
  if (error || !hotel)
    return (
      <div className="hotel-detail">
        <div className="container">
          <div className="error-msg">
            {error || "Không tìm thấy khách sạn."}
          </div>
        </div>
      </div>
    );

  // Dữ liệu mẫu/fallback nếu thiếu trường
  const sampleImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
  ];
  const images =
    hotel.images && hotel.images.length >= 7
      ? hotel.images.slice(0, 7)
      : sampleImages;
  const amenities = hotel.amenities || [];
  const name = hotel.name || hotel.basicInfo?.name || "Tên khách sạn";
  const locationText = hotel.location || hotel.basicInfo?.address || "Địa chỉ";
  const rating = hotel.rating?.average || hotel.rating || 0;
  const reviewCount = hotel.rating?.reviewCount || hotel.reviewCount || 0;
  const price =
    hotel.rooms && hotel.rooms[0]
      ? hotel.rooms[0].pricePerNight || hotel.rooms[0].price
      : hotel.price || 0;
  const badge = hotel.badge;

  return (
    <div className="hotel-detail">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Trang chủ", to: "/" },
            { label: "Khách sạn", to: "/hotels" },
            { label: name },
          ]}
        />
        <div className="hotel-gallery-new">
          <div className="main-image">
            <img src={images[0] || "/placeholder.svg"} alt={name} />
          </div>
          <div className="gallery-thumbnails">
            {images.slice(1, 7).map((image, idx) => (
              <div className="thumbnail" key={idx}>
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${name} ${idx + 2}`}
                />
              </div>
            ))}
            {/* Nếu thiếu ảnh thì thêm placeholder */}
            {Array.from({ length: Math.max(0, 6 - (images.length - 1)) }).map(
              (_, idx) => (
                <div className="thumbnail" key={`ph-${idx}`}>
                  <img src="/placeholder.svg" alt="placeholder" />
                </div>
              )
            )}
          </div>
        </div>

        <div className="hotel-header">
          <div className="hotel-title">
            <h1>{name}</h1>
            {badge && <span className="hotel-badge">{badge}</span>}
          </div>
          <div className="hotel-meta">
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="rating-value">{rating}</span>
              <span className="reviews">({reviewCount} đánh giá)</span>
            </div>
            <p className="location">{locationText}</p>
          </div>
        </div>

        <div className="hotel-content">
          {/* Xóa phần hotel-gallery cũ ở đây */}

          <div className="hotel-info">
            <div className="hotel-description">
              <h2>Thông tin khách sạn</h2>
              <div className="features">
                {/* Có thể render các tiện ích nổi bật ở đây */}
                {amenities.slice(0, 3).map((am, idx) => (
                  <span className="feature" key={idx}>
                    {am}
                  </span>
                ))}
              </div>
            </div>

            <div className="booking-card card">
              <div className="price">
                <span className="amount">
                  {price ? price.toLocaleString("vi-VN") + " VND" : "Liên hệ"}
                </span>
                <span className="period">/ngày</span>
              </div>

              <div className="booking-form">
                <div className="date-inputs">
                  <div className="input-group">
                    <label>Nhận phòng</label>
                    <input type="date" />
                  </div>
                  <div className="input-group">
                    <label>Trả phòng</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Số khách</label>
                  <select>
                    <option>1 khách</option>
                    <option>2 khách</option>
                    <option>3 khách</option>
                    <option>4 khách</option>
                  </select>
                </div>
                <button
                  onClick={handleBookNow}
                  className="btn btn-primary btn-full"
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hotel-amenities">
          <h3>Tiện nghi nổi bật</h3>
          <div className="amenities-grid">
            {amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                <span className="amenity-icon">🏨</span>
                <div className="amenity-content">
                  <h4>{amenity}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
