"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HotelRooms.scss";
import { fetchAllHotels, fetchHotelById } from "../../server/hotelAPI";

const HotelRooms = () => {
  const [filters, setFilters] = useState({
    popularFilters: [],
    accommodationTypes: [],
    starRatings: [],
    paymentOptions: [],
    propertyAmenities: [],
    guestRatings: [],
    distanceToCenter: [],
    roomAmenities: [],
    bedTypes: [],
    priceRange: [],
    sortBy: "bestLowToHigh",
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [cardLoading, setCardLoading] = useState(null); // id of hotel being loaded

  useEffect(() => {
    fetchAllHotels()
      .then((data) => {
        if (data.length === 0) {
          setError("Không thể tải danh sách khách sạn. Hiển thị dữ liệu mẫu.");
        } else {
          setHotels(
            data.map((hotel, idx) => ({
              id: hotel._id || idx,
              name: hotel.name,
              location: hotel.address,
              price: hotel.rooms && hotel.rooms[0] ? hotel.rooms[0].price : 0,
              rating: hotel.rating || 0,
              reviews: hotel.reviewCount
                ? `${hotel.reviewCount} đánh giá`
                : "Chưa có đánh giá",
              image:
                hotel.images && hotel.images[0]
                  ? hotel.images[0]
                  : "/placeholder.svg",
              amenities: hotel.amenities || [],
            }))
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách khách sạn. Hiển thị dữ liệu mẫu.");

        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  // Khi click vào card khách sạn
  const handleHotelClick = async (hotelId) => {
    setCardLoading(hotelId);
    const detail = await fetchHotelById(hotelId);
    setCardLoading(null);
    if (detail) {
      navigate(`/hotel/${hotelId}`, { state: { hotel: detail } });
    } else {
      alert("Không thể tải chi tiết khách sạn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="hotel-rooms">
      <div className="container">
        <div className="page-header">
          <h1>Danh sách khách sạn</h1>
          <p>
            Khám phá và lựa chọn khách sạn phù hợp cho chuyến đi của bạn. Ưu đãi
            hấp dẫn, phòng đẹp, giá tốt, đặt phòng nhanh chóng!
          </p>
        </div>

        <div className="content-layout">
          <div className="hotels-list">
            {loading ? (
              <div>Đang tải khách sạn...</div>
            ) : (
              hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`hotel-card${
                    cardLoading === hotel.id ? " loading" : ""
                  }`}
                  onClick={() => handleHotelClick(hotel.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="hotel-image">
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                    />
                  </div>
                  <div className="hotel-details">
                    <div className="hotel-header">
                      <h3 className="hotel-name">{hotel.name}</h3>
                      <div className="hotel-rating">
                        <div className="stars">
                          {[...Array(Math.round(hotel.rating))].map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        <span className="reviews">{hotel.reviews}</span>
                      </div>
                    </div>
                    <p className="hotel-location">📍 {hotel.location}</p>
                    <div className="hotel-amenities">
                      {hotel.amenities.map((amenity, index) => (
                        <span key={index} className="amenity">
                          {amenity === "Free wifi" && "📶"}
                          {amenity === "Free breakfast" && "🍳"}
                          {amenity === "Guest service" && "👤"}
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="hotel-footer">
                      <div className="price">
                        <span className="amount">
                          {hotel.price
                            ? hotel.price.toLocaleString("vi-VN") + " VND"
                            : "Liên hệ"}
                        </span>
                        <span className="period">/ngày</span>
                      </div>
                      {/* Xóa Link, click cả card */}
                    </div>
                  </div>
                  {cardLoading === hotel.id && (
                    <div className="card-loading-overlay">Đang tải...</div>
                  )}
                </div>
              ))
            )}
            {error && <div className="error-msg">{error}</div>}
            <div className="show-more">
              <button className="btn btn-primary">Xem thêm</button>
            </div>
          </div>

          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>BỘ LỌC</h3>
              <button
                className="clear-btn"
                onClick={() =>
                  setFilters({
                    popularFilters: [],
                    accommodationTypes: [],
                    starRatings: [],
                    paymentOptions: [],
                    propertyAmenities: [],
                    guestRatings: [],
                    distanceToCenter: [],
                    roomAmenities: [],
                    bedTypes: [],
                    priceRange: [],
                    sortBy: "bestLowToHigh",
                  })
                }
              >
                XÓA TẤT CẢ
              </button>
            </div>

            {/* Khoảng giá */}
            <div className="filter-section">
              <h4>Khoảng giá</h4>
              <div className="filter-options">
                {[
                  "250.000đ - 500.000đ",
                  "500.000đ - 1.000.000đ",
                  "1.000.000đ - 1.500.000đ",
                ].map((range) => (
                  <label key={range} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes(range)}
                      onChange={() => handleFilterChange("priceRange", range)}
                    />
                    <span className="checkmark"></span>
                    {range}
                  </label>
                ))}
              </div>
            </div>

            {/* Sắp xếp theo */}
            <div className="filter-section">
              <h4>Sắp xếp theo</h4>
              <div className="filter-options">
                {[
                  { value: "bestLowToHigh", label: "Ưu tiên giá thấp" },
                  { value: "priceHighToLow", label: "Giá cao đến thấp" },
                  { value: "newestFirst", label: "Mới nhất" },
                ].map((option) => (
                  <label key={option.value} className="filter-option">
                    <input
                      type="radio"
                      name="sortBy"
                      checked={filters.sortBy === option.value}
                      onChange={() => handleSortChange(option.value)}
                    />
                    <span className="radiomark"></span>
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Bộ lọc phổ biến */}
            <div className="filter-section">
              <h4>Bộ lọc phổ biến</h4>
              <div className="filter-options">
                {[
                  "Vị trí: 8+ Xuất sắc",
                  "Tủ lạnh",
                  "Điều hòa",
                  "TV",
                  "Hủy miễn phí",
                  "Đặt không cần thẻ tín dụng",
                  "Trả tiền liền",
                  "Xếp hạng của khách: 8+ Xuất sắc",
                ].map((filter) => (
                  <label key={filter} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.popularFilters.includes(filter)}
                      onChange={() =>
                        handleFilterChange("popularFilters", filter)
                      }
                    />
                    <span className="checkmark"></span>
                    {filter}
                  </label>
                ))}
              </div>
            </div>

            {/* Loại hình nơi ở */}
            <div className="filter-section">
              <h4>Loại hình nơi ở</h4>
              <div className="filter-options">
                {[
                  "Khách sạn",
                  "Resort",
                  "Nhà nghỉ",
                  "Căn hộ",
                  "Biệt thự nghỉ dưỡng",
                ].map((type) => (
                  <label key={type} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.accommodationTypes.includes(type)}
                      onChange={() =>
                        handleFilterChange("accommodationTypes", type)
                      }
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Xếp hạng sao */}
            <div className="filter-section">
              <h4>Xếp hạng sao</h4>
              <div className="filter-options">
                {[
                  "5-Đánh giá sao",
                  "4-Đánh giá sao",
                  "3-Đánh giá sao",
                  "2-Đánh giá sao",
                  "1-Đánh giá sao",
                ].map((star) => (
                  <label key={star} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.starRatings.includes(star)}
                      onChange={() => handleFilterChange("starRatings", star)}
                    />
                    <span className="checkmark"></span>
                    {star}
                  </label>
                ))}
              </div>
            </div>

            {/* Lựa chọn thanh toán */}
            <div className="filter-section">
              <h4>Lựa chọn thanh toán</h4>
              <div className="filter-options">
                {[
                  "Hủy miễn phí",
                  "Thanh toán tại nơi ở",
                  "Đặt trước, trả tiền sau",
                  "Trả tiền liền",
                  "Đặt không cần thẻ tín dụng",
                ].map((option) => (
                  <label key={option} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.paymentOptions.includes(option)}
                      onChange={() =>
                        handleFilterChange("paymentOptions", option)
                      }
                    />
                    <span className="checkmark"></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {/* Tiện nghi chỗ nghỉ */}
            <div className="filter-section">
              <h4>Tiện nghi chỗ nghỉ</h4>
              <div className="filter-options">
                {[
                  "Bể bơi",
                  "Internet",
                  "Bãi để xe",
                  "Đưa đón sân bay",
                  "Phòng tập",
                  "Bàn tiếp tân [24 giờ]",
                  "Thích hợp cho gia đình/trẻ em",
                  "Không hút thuốc",
                  "Spa/xông khô",
                  "Nhà hàng",
                  "Khu vực hút thuốc",
                  "Được phép đưa thú nuôi vào",
                ].map((amenity) => (
                  <label key={amenity} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.propertyAmenities.includes(amenity)}
                      onChange={() =>
                        handleFilterChange("propertyAmenities", amenity)
                      }
                    />
                    <span className="checkmark"></span>
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            {/* Đánh giá của khách */}
            <div className="filter-section">
              <h4>Đánh giá của khách</h4>
              <div className="filter-options">
                {[
                  "9+ Trên cả tuyệt vời",
                  "8+ Xuất sắc",
                  "7+ Rất tốt",
                  "6+ Hài lòng (151)",
                ].map((rate) => (
                  <label key={rate} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.guestRatings.includes(rate)}
                      onChange={() => handleFilterChange("guestRatings", rate)}
                    />
                    <span className="checkmark"></span>
                    {rate}
                  </label>
                ))}
              </div>
            </div>

            {/* Khoảng cách đến trung tâm */}
            <div className="filter-section">
              <h4>Khoảng cách đến trung tâm</h4>
              <div className="filter-options">
                {[
                  "Bên trong trung tâm thành phố",
                  "cách trung tâm <2 km",
                  "cách trung tâm 2-5 km",
                  "cách trung tâm 5-10 km",
                  "cách trung tâm >10 km",
                ].map((distance) => (
                  <label key={distance} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.distanceToCenter.includes(distance)}
                      onChange={() =>
                        handleFilterChange("distanceToCenter", distance)
                      }
                    />
                    <span className="checkmark"></span>
                    {distance}
                  </label>
                ))}
              </div>
            </div>

            {/* Tiện nghi phòng */}
            <div className="filter-section">
              <h4>Tiện nghi phòng</h4>
              <div className="filter-options">
                {[
                  "Điều hòa",
                  "TV",
                  "Tủ lạnh",
                  "Truy cập Internet",
                  "Ban công/sân hiên",
                  "Tiện nghi là/ủi",
                  "Bồn tắm",
                  "Máy giặt",
                  "Máy pha trà/cà phê",
                  "Bếp",
                  "Bể bơi riêng",
                  "Sưởi",
                  "Được phép đưa thú cưng vào phòng",
                ].map((roomAmenity) => (
                  <label key={roomAmenity} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.roomAmenities.includes(roomAmenity)}
                      onChange={() =>
                        handleFilterChange("roomAmenities", roomAmenity)
                      }
                    />
                    <span className="checkmark"></span>
                    {roomAmenity}
                  </label>
                ))}
              </div>
            </div>

            {/* Loại giường */}
            <div className="filter-section">
              <h4>Loại giường</h4>
              <div className="filter-options">
                {[
                  "Đôi",
                  "Giường đôi lớn",
                  "Đơn/hai giường đơn",
                  "Giường lớn",
                  "Giường tầng",
                ].map((bed) => (
                  <label key={bed} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.bedTypes.includes(bed)}
                      onChange={() => handleFilterChange("bedTypes", bed)}
                    />
                    <span className="checkmark"></span>
                    {bed}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRooms;
