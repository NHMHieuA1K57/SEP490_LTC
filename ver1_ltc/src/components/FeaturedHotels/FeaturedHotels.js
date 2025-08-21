import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./FeaturedHotels.scss";

const FeaturedHotels = () => {
  const hotels = [
    {
      id: 1,
      name: "The Grand Resort",
      location: "Maldives",
      price: 450,
      rating: 4.8,
      image:
        "/placeholder.svg?height=300&width=400&text=Luxury+Resort+Maldives",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Ocean View Hotel",
      location: "Bali, Indonesia",
      price: 320,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400&text=Ocean+View+Bali",
      badge: "Best Seller",
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Swiss Alps",
      price: 580,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400&text=Mountain+Lodge+Alps",
    },
    {
      id: 4,
      name: "City Center Hotel",
      location: "New York, USA",
      price: 280,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400&text=NYC+Hotel",
    },
    {
      id: 5,
      name: "Beach Paradise Resort",
      location: "Phuket, Thailand",
      price: 380,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400&text=Beach+Paradise+Phuket",
      badge: "Popular",
    },
    {
      id: 6,
      name: "Desert Oasis Hotel",
      location: "Dubai, UAE",
      price: 520,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400&text=Desert+Oasis+Dubai",
    },
  ];

  return (
    <section className="featured-hotels">
      <div className="container">
        <div className="section-header">
          <h2>Featured Hotels</h2>
          <p>
            Discover our handpicked selection of exceptional properties around
            the world, offering unmatched luxury and unforgettable experiences.
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
                <div className="hotel-header">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-value">{hotel.rating}</span>
                  </div>
                </div>
                <p className="hotel-location">{hotel.location}</p>
                <div className="hotel-footer">
                  <div className="hotel-price">
                    <span className="price">${hotel.price}</span>
                    <span className="period">/night</span>
                  </div>
                  <Link to={`/hotel/${hotel.id}`} className="btn btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="section-footer">
          <Link to="/hotels" className="btn btn-outline">
            View All Hotels
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
