"use client";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHotelById } from "../../server/hotelAPI";
import "./HotelDetail.scss";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const HotelDetail = () => {
  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1,
    3: 1,
  });

  const roomOptions = [
    {
      id: 1,
      title: "Giá thấp nhất!",
      originalPrice: 525195,
      discountedPrice: 200.0,
      discount: 67,
      capacity: "Đã áp dụng 21.329",
      amenities: ["Chính sách hủy", "Đặt và trả tiền ngay", "WiFi miễn phí"],
      isLowestPrice: true,
    },
    {
      id: 2,
      title: "",
      originalPrice: 525195,
      discountedPrice: 276605,
      discount: 47,
      capacity: "Đã áp dụng 6.330",
      amenities: ["Chính sách hủy", "Đặt và trả tiền ngay", "WiFi miễn phí"],
      hasTimeLimit: true,
    },
    {
      id: 3,
      title: "",
      originalPrice: 414906,
      discountedPrice: 103727,
      discount: 75,
      capacity: "Đã áp dụng 2.374",
      amenities: ["Chính sách hủy", "Đặt và trả tiền ngay", "WiFi miễn phí"],
      isLastMinute: true,
      hasPromotion: true,
      promotionText: "Hiếm! Giá hấp dẫn của chúng tôi trong tháng trước",
      hasCapacityWarning: true,
    },
  ];

  const handleQuantityChange = (roomId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [roomId]: quantity,
    }));
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };
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

  // Kiểm tra đăng nhập qua localStorage (ví dụ lưu accessToken)
  const handleBookNow = (option) => {
    const accessToken = localStorage.getItem("accessToken");

    const bookingData = {
      hotel: name,
      room: "Nhà trệt (Bungalow)", // hoặc hotel.rooms[0].name nếu có dữ liệu
      roomPrice: option.discountedPrice,
      nights: 1, // có thể cho user chọn, tạm thời fix
      checkIn: "2025-08-28",
      checkOut: "2025-08-29",
      guests: 2,

      total: option.discountedPrice * 1,
    };

    if (
      !accessToken ||
      accessToken === "undefined" ||
      accessToken === "null" ||
      accessToken.trim() === ""
    ) {
      navigate("/payment", { state: { booking: bookingData } });
    } else {
      navigate("/payment", { state: { booking: bookingData } });
    }
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

            <div className="room-booking">
              <header className="room-booking__header">
                <h1>Chọn phòng</h1>
                <div className="room-booking__login">
                  <span>👤 Chúng tôi khớp giá!</span>
                </div>
              </header>

              <div className="room-booking__subtitle">
                <p>
                  Hiện có <strong>1 loại phòng</strong> với{" "}
                  <span className="highlight">
                    chỉ còn tổng cộng 3 lựa chọn
                  </span>
                </p>
                <p className="room-booking__note">
                  🏷️ Giá không bao gồm thuế & phí
                </p>
              </div>

              {/* Wrapper to match hotel-gallery-new width */}
              <div className="room-booking__content-wide">
                <div className="room-booking__sidebar">
                  <h2>Nhà trệt (Bungalow)</h2>

                  <div className="room-booking__room-type">
                    <h3>Loại phòng</h3>
                    <div className="room-booking__room-image">
                      <img
                        src="/placeholder.svg?height=150&width=200&text=Bunk+Bed+Room"
                        alt="Room with bunk beds"
                      />
                      <button className="room-booking__view-details">
                        Xem ảnh và chi tiết
                      </button>
                    </div>

                    <div className="room-booking__room-info">
                      <div className="room-booking__bed-info">
                        <span>🛏️ 1 giường lớn & 6 giường tầng</span>
                      </div>
                      <div className="room-booking__size-info">
                        <span>🏠 Diện tích phòng: 15 m²</span>
                      </div>
                      <button className="room-booking__amenities-btn">
                        ➕ Các tiện ích khác
                      </button>
                    </div>
                  </div>
                </div>

                <div className="room-booking__options">
                  {roomOptions.map((option) => (
                    <div key={option.id} className="room-booking__option">
                      {option.isLowestPrice && (
                        <div className="room-booking__option-header">
                          <span className="room-booking__best-price">
                            {option.title}
                          </span>
                        </div>
                      )}

                      <div className="room-booking__option-content">
                        <div className="room-booking__amenities">
                          {option.amenities.map((amenity, index) => (
                            <div key={index} className="room-booking__amenity">
                              <span className="checkmark">✓</span>
                              <span>{amenity}</span>
                              {index === 0 && (
                                <span className="room-booking__info-icon">
                                  ℹ️
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="room-booking__capacity">
                          <div className="room-booking__guest-icons">
                            <span className="guest-icon">👥</span>
                            <span className="guest-count">2</span>
                            {option.hasCapacityWarning && (
                              <div className="room-booking__warning-badge">
                                <span>⚠️</span>
                              </div>
                            )}
                          </div>
                          {option.hasCapacityWarning && (
                            <div className="room-booking__capacity-warning">
                              <span>Vượt quá sức chứa phòng</span>
                            </div>
                          )}
                        </div>

                        <div className="room-booking__pricing">
                          <div className="room-booking__promotion-badge">
                            <span className="green-badge">
                              🟢 {option.capacity} ₫
                            </span>
                            <span className="red-badge">1</span>
                          </div>

                          {option.hasPromotion && (
                            <div className="room-booking__promotion-text">
                              <span className="promotion-warning">Hiếm 🛡️</span>
                              <div className="promotion-desc">
                                {option.promotionText}
                              </div>
                            </div>
                          )}

                          <div className="room-booking__price-info">
                            <div className="room-booking__original-price">
                              {formatPrice(option.originalPrice)} ₫ -
                              {option.discount}%
                            </div>
                            <div className="room-booking__discounted-price">
                              {formatPrice(option.discountedPrice)} ₫
                            </div>
                            <div className="room-booking__price-note">
                              Giá mỗi đêm chưa gồm thuế và phí
                            </div>
                          </div>
                        </div>

                        <div className="room-booking__booking-section">
                          <div className="room-booking__quantity-section">
                            <div className="room-booking__quantity-display">
                              <span className="quantity-number">
                                {quantities[option.id]}
                              </span>
                            </div>
                            {option.hasCapacityWarning && (
                              <div className="room-booking__capacity-excess">
                                <span>vượt quá 1 khách</span>
                                <span className="excess-badge">1</span>
                              </div>
                            )}
                          </div>

                          <div className="room-booking__actions">
                            <button
                              className="room-booking__book-now"
                              onClick={() => handleBookNow(option)}
                            >
                              Đặt ngay
                            </button>

                            {(option.hasTimeLimit || option.isLastMinute) && (
                              <div className="room-booking__time-limit">
                                <span>Đặt trong 2 phút</span>
                              </div>
                            )}

                            <div className="room-booking__final-promotion">
                              <span>Phòng cuối cùng của chúng tôi!</span>
                            </div>

                            {option.hasCapacityWarning && (
                              <div className="room-booking__capacity-warning-final">
                                <span>Vượt quá sức chứa phòng</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
