"use client";
import Carousel from "../Carousel/Carousel";
import "./FeaturedHotels.scss";

const FeaturedHotels = ({ onViewDetails }) => {
  // Có nhiều khách sạn để carousel có thể scroll
  const hotels = [
    {
      id: 1,
      name: "The Grand Resort",
      location: "Maldives",
      price: 450,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Ocean View Villa",
      location: "Santorini",
      price: 380,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Most Popular",
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Swiss Alps",
      price: 520,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "City Palace Hotel",
      location: "Dubai",
      price: 680,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Luxury",
    },
    {
      id: 5,
      name: "Beachfront Paradise",
      location: "Bali",
      price: 320,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Great Value",
    },
    {
      id: 6,
      name: "Urban Boutique",
      location: "Tokyo",
      price: 420,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      name: "Desert Oasis",
      location: "Morocco",
      price: 280,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Exotic",
    },
    {
      id: 8,
      name: "Alpine Retreat",
      location: "Austria",
      price: 390,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="featured-hotels section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Hotels</h2>
          <p className="section-subtitle">
            Discover our handpicked selection of exceptional properties around
            the world, offering unique charm, luxury and unforgettable
            experiences.
          </p>
        </div>

        <Carousel itemsPerView={4} gap={16}>
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              {hotel.badge && (
                <div
                  className={`hotel-card__badge hotel-card__badge--${hotel.badge
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {hotel.badge}
                </div>
              )}

              <div className="hotel-card__image">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} />
              </div>

              <div className="hotel-card__content">
                <div className="hotel-card__header">
                  <h3 className="hotel-card__name">{hotel.name}</h3>
                  <div className="hotel-card__rating">
                    <span className="rating-icon">⭐</span>
                    <span className="rating-value">{hotel.rating}</span>
                  </div>
                </div>

                <p className="hotel-card__location">📍 {hotel.location}</p>

                <div className="hotel-card__footer">
                  <div className="hotel-card__price">
                    <span className="price-amount">${hotel.price}</span>
                    <span className="price-period">/ night</span>
                  </div>
                  <button className="btn-view-details" onClick={onViewDetails}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="section-footer">
          <button className="btn btn-secondary">View All Hotels</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;
