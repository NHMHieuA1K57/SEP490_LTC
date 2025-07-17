import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./FeaturedHotels.scss";

const FeaturedHotels = () => {
  const hotels = [
    {
      id: 1,
      name: "Khu nghỉ dưỡng Grand",
      location: "Phú Quốc, Việt Nam",
      price: 450000,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400&text=Khu+nghỉ+dưỡng+Grand",
      badge: "Bán chạy nhất",
    },
    {
      id: 2,
      name: "Khách sạn View Biển",
      location: "Nha Trang, Việt Nam",
      price: 320000,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400&text=View+Biển+Nha+Trang",
      badge: "Bán chạy nhất",
    },
    {
      id: 3,
      name: "Nhà nghỉ Núi",
      location: "Sa Pa, Việt Nam",
      price: 580000,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400&text=Nhà+nghỉ+Núi+Sa+Pa",
    },
    {
      id: 4,
      name: "Khách sạn Trung tâm",
      location: "Hà Nội, Việt Nam",
      price: 280000,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400&text=Trung+Tâm+Hà+Nội",
    },
    {
      id: 5,
      name: "Khu nghỉ dưỡng Biển Xanh",
      location: "Đà Nẵng, Việt Nam",
      price: 380000,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400&text=Biển+Xanh+Đà+Nẵng",
      badge: "Phổ biến",
    },
    {
      id: 6,
      name: "Khách sạn Ốc đảo",
      location: "Phan Thiết, Việt Nam",
      price: 520000,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400&text=Ốc+đảo+Phan+Thiết",
    },
  ];

  // Hàm format giá tiền kiểu 400.000 VND
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
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

        <Carousel itemsPerView={4} gap={24}>
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card card">
              <div className="hotel-image">
                {hotel.badge && (
                  <span className="hotel-badge">{hotel.badge}</span>
                )}
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} />
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
                    <span className="hotel-note">Chưa bao gồm thuế và phí</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

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
