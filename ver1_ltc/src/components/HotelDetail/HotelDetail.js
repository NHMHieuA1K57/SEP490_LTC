import React, { useState } from "react";
import "./HotelDetail.scss";

const HotelDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const hotel = {
    name: "The Grand Resort",
    badge: "Google Book",
    rating: 4.8,
    reviews: "300+ reviews",
    location: "Los Angeles, California, USA",
    price: 299,
    description: "Experience Luxury Like Never Before",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    ],
    amenities: [
      {
        icon: "🏠",
        title: "Clean Room",
        description: "You will love the clean room for you.",
      },
      {
        icon: "✨",
        title: "Enhanced Clean",
        description: "This host has committed to Staybnb's cleaning process.",
      },
      {
        icon: "📍",
        title: "Great location",
        description: "95% of recent guests gave the location a 5-star rating.",
      },
      {
        icon: "🎯",
        title: "Great check-in experience",
        description:
          "100% of recent guests gave the check-in process a 5-star rating.",
      },
    ],
    host: {
      name: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      reviews: "200+ reviews",
      responseRate: "100%",
      responseTime: "30 min",
    },
  };

  const handleBooking = (e) => {
    e.preventDefault();
    console.log("Booking:", { checkIn, checkOut, guests });
  };

  return (
    <div className="hotel-detail">
      <div className="container">
        {/* Header */}
        <div className="hotel-detail__header">
          <div className="hotel-info">
            <div className="hotel-title">
              <h1>{hotel.name}</h1>
              <span className="google-badge">{hotel.badge}</span>
              <span className="orange-badge">ORANGE</span>
            </div>
            <div className="hotel-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`star ${
                      i < Math.floor(hotel.rating) ? "filled" : ""
                    }`}
                  >
                    ⭐
                  </span>
                ))}
                <span className="rating-text">{hotel.reviews}</span>
              </div>
            </div>
            <div className="hotel-location">📍 {hotel.location}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="hotel-detail__content">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image">
              <img
                src={hotel.images[selectedImage] || "/placeholder.svg"}
                alt={hotel.name}
              />
            </div>
            <div className="thumbnail-grid">
              {hotel.images.slice(1).map((image, index) => (
                <div
                  key={index + 1}
                  className={`thumbnail ${
                    selectedImage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index + 1)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${hotel.name} ${index + 2}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section">
            <div className="price-info">
              <h2>{hotel.description}</h2>
              <div className="amenity-tags">
                <span className="tag">🏠 Entire place</span>
                <span className="tag">🍳 Free breakfast</span>
                <span className="tag">🏊 Swimming pool</span>
              </div>
              <div className="price">
                <span className="amount">${hotel.price}</span>
                <span className="period">/day</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBooking}>
              <div className="form-row">
                <div className="form-field">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="check-availability-btn">
                Check Availability
              </button>
            </form>
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities-section">
          {hotel.amenities.map((amenity, index) => (
            <div key={index} className="amenity-item">
              <div className="amenity-icon">{amenity.icon}</div>
              <div className="amenity-content">
                <h3>{amenity.title}</h3>
                <p>{amenity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="description-section">
          <p>
            The entire apartment will be yours! It's a cozy and clean space in
            the heart of the city. The entire apartment will be yours! It's a
            cozy and clean space in the heart of the city. The entire apartment
            will be yours! It's a cozy and clean space in the heart of the city.
            The entire apartment will be yours! It's a cozy and clean space in
            the heart of the city. The entire apartment will be yours! It's a
            cozy and clean space in the heart of the city. The entire apartment
            will be yours! It's a cozy and clean space in the heart of the city.
            The entire apartment will be yours! It's a cozy and clean space in
            the heart of the city. The entire apartment will be yours! It's a
            cozy and clean space in the heart of the city.
          </p>
        </div>

        {/* Location Map */}
        <div className="location-section">
          <h2>Location on map</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-marker">📍</div>
              <div className="map-info">
                <p>Exact location provided after booking</p>
              </div>
            </div>
          </div>
          <div className="location-info">
            <h3>{hotel.location}</h3>
            <p>It's like a home away from home</p>
          </div>
        </div>

        {/* Host Information */}
        <div className="host-section">
          <div className="host-info">
            <img
              src={hotel.host.avatar || "/placeholder.svg"}
              alt={hotel.host.name}
              className="host-avatar"
            />
            <div className="host-details">
              <h3>Hosted by {hotel.host.name}</h3>
              <div className="host-stats">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${
                        i < Math.floor(hotel.host.rating) ? "filled" : ""
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className="rating-text">{hotel.host.reviews}</span>
                </div>
                <div className="response-info">
                  <span>Response rate: {hotel.host.responseRate}</span>
                  <span>Response time: {hotel.host.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="contact-btn">Contact Now</button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
