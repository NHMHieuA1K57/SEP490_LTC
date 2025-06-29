"use client";

import { useParams, useNavigate } from "react-router-dom";
import "./HotelDetail.scss";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const hotel = {
    name: "The Grand Resort",
    type: "Deluxe Ocean View",
    location: "Maldives, Indian Ocean",
    rating: 4.8,
    reviews: 300,
    price: 450,
    badge: "LUXURY",
    images: [
      "/placeholder.svg?height=400&width=600&text=Main+Resort+View",
      "/placeholder.svg?height=200&width=300&text=Pool+Area",
      "/placeholder.svg?height=200&width=300&text=Beach+View",
      "/placeholder.svg?height=200&width=300&text=Restaurant",
      "/placeholder.svg?height=200&width=300&text=Spa+Center",
    ],
    amenities: [
      {
        icon: "🏠",
        title: "Luxury Room",
        description: "Spacious rooms with ocean view and premium amenities.",
      },
      {
        icon: "✨",
        title: "Premium Service",
        description: "24/7 concierge service and daily housekeeping.",
      },
      {
        icon: "📍",
        title: "Prime Location",
        description: "Beachfront location with private beach access.",
      },
      {
        icon: "⭐",
        title: "5-Star Experience",
        description: "Award-winning resort with world-class facilities.",
      },
    ],
  };

  const handleBookNow = () => {
    navigate("/payment");
  };

  return (
    <div className="hotel-detail">
      <div className="container">
        <div className="hotel-header">
          <div className="hotel-title">
            <h1>
              {hotel.name} <span className="hotel-type">({hotel.type})</span>
            </h1>
            {hotel.badge && <span className="hotel-badge">{hotel.badge}</span>}
          </div>
          <div className="hotel-meta">
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="rating-value">{hotel.rating}</span>
              <span className="reviews">({hotel.reviews} reviews)</span>
            </div>
            <p className="location">{hotel.location}</p>
          </div>
        </div>

        <div className="hotel-content">
          <div className="hotel-gallery">
            <div className="main-image">
              <img
                src={hotel.images[0] || "/placeholder.svg"}
                alt={hotel.name}
              />
            </div>
            <div className="gallery-grid">
              {hotel.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${hotel.name} ${index + 2}`}
                />
              ))}
            </div>
          </div>

          <div className="hotel-info">
            <div className="hotel-description">
              <h2>Experience Luxury Like Never Before</h2>
              <div className="features">
                <span className="feature">🏊‍♂️ Pool</span>
                <span className="feature">🍳 Free breakfast</span>
                <span className="feature">📶 Good wifi</span>
              </div>
            </div>

            <div className="booking-card card">
              <div className="price">
                <span className="amount">${hotel.price}</span>
                <span className="period">/day</span>
              </div>

              <div className="booking-form">
                <div className="date-inputs">
                  <div className="input-group">
                    <label>Check-in</label>
                    <input type="date" defaultValue="2025-01-01" />
                  </div>
                  <div className="input-group">
                    <label>Check-out</label>
                    <input type="date" defaultValue="2025-01-03" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Guests</label>
                  <select>
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>
                <button
                  onClick={handleBookNow}
                  className="btn btn-primary btn-full"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hotel-amenities">
          <h3>What this place offers</h3>
          <div className="amenities-grid">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                <span className="amenity-icon">{amenity.icon}</span>
                <div className="amenity-content">
                  <h4>{amenity.title}</h4>
                  <p>{amenity.description}</p>
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