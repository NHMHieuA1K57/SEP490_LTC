import { Link, useNavigate } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./FeaturedHotels.scss";
import { useEffect, useState } from "react";
import { fetchAllHotels } from "../../server/hotelAPI";

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardLoading, setCardLoading] = useState(null);
  const navigate = useNavigate();

  // fallback data nếu fetch lỗi

  useEffect(() => {
    fetchAllHotels()
      .then((data) => {
        if (data.length === 0) {
          setError("Không thể tải danh sách khách sạn. Hiển thị dữ liệu mẫu.");
        } else {
          setHotels(
            data.map((hotel, idx) => {
              let firstRoomPrice = 0;
              if (
                hotel.rooms &&
                Array.isArray(hotel.rooms) &&
                hotel.rooms.length > 0
              ) {
                // Nếu phần tử đầu là object và có price
                if (
                  typeof hotel.rooms[0] === "object" &&
                  hotel.rooms[0] !== null &&
                  "price" in hotel.rooms[0]
                ) {
                  firstRoomPrice = hotel.rooms[0]?.price;
                }
              }
              return {
                id: hotel._id || idx,
                name: hotel.name,
                location: hotel.address,
                price: firstRoomPrice,
                rating: hotel.rating || 0,
                image:
                  hotel.images && hotel.images[0]
                    ? hotel.images[0]
                    : "/placeholder.svg",
                badge: idx < 2 ? "Bán chạy nhất" : undefined,
              };
            })
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

  // Hàm format giá tiền kiểu 400.000 VND
  const formatPrice = (price) => {
    return price ? price.toLocaleString("vi-VN") + " VND" : "Liên hệ";
  };

  // Khi click vào card khách sạn
  const handleHotelClick = (hotel) => {
    setCardLoading(hotel.id);
    navigate(`/hotel/${hotel.id}`, { state: { hotel } });
    setTimeout(() => setCardLoading(null), 500); // clear loading after navigation
  };

  return (
    <section className="featured-hotels">
      <div className="container">
        <div className="section-header">
          <h2>Khách sạn nổi bật</h2>
          <p>
            Khám phá những khách sạn được lựa chọn kỹ lưỡng, mang đến trải
            nghiệm sang trọng và đáng nhớ trên khắp Việt Nam.
          </p>
        </div>
        {loading ? (
          <div>Đang tải khách sạn...</div>
        ) : (
          <Carousel itemsPerView={4} gap={24}>
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className={`hotel-card card${
                  cardLoading === hotel.id ? " loading" : ""
                }`}
                onClick={() => handleHotelClick(hotel)}
                style={{ cursor: "pointer" }}
              >
                <div className="hotel-image">
                  {hotel.badge && (
                    <span className="hotel-badge">{hotel.badge}</span>
                  )}
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                  />
                </div>
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <p className="hotel-location">{hotel.location}</p>
                  <div className="hotel-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-value">{hotel.rating}</span>
                  </div>
                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price">{formatPrice(hotel.price)}</span>
                      <span className="hotel-note">
                        Chưa bao gồm thuế và phí
                      </span>
                    </div>
                  </div>
                </div>
                {cardLoading === hotel.id && (
                  <div className="card-loading-overlay">Đang tải...</div>
                )}
              </div>
            ))}
          </Carousel>
        )}
        {error && <div className="error-msg">{error}</div>}
        <div className="section-footer">
          <Link to="/hotels" className="btn btn-outline">
            Xem tất cả khách sạn
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
