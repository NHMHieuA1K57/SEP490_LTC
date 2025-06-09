import React from "react";
import Carousel from "../Carousel/Carousel";
import "./ExclusiveOffers.scss";

const ExclusiveOffers = () => {
  const offers = [
    {
      id: 1,
      discount: "25% OFF",
      title: "Luxury Weekend Package",
      description: "Enjoy a complimentary upgrade and daily breakfast",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cta: "View Offers",
    },
    {
      id: 2,
      discount: "30% OFF",
      title: "Summer Getaway Special",
      description: "Special couples package with spa treatments",
      image:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cta: "View Offers",
    },
    {
      id: 3,
      discount: "40% OFF",
      title: "Family Fun Special",
      description: "Book 60 days in advance and save up to 40% off",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cta: "View Offers",
    },
    {
      id: 4,
      discount: "50% OFF",
      title: "Last Minute Deals",
      description: "Book within 24 hours and get amazing discounts",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cta: "View Offers",
    },
    {
      id: 5,
      discount: "35% OFF",
      title: "Honeymoon Package",
      description: "Romantic getaway with champagne and rose petals",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cta: "View Offers",
    },
  ];

  return (
    <section className="exclusive-offers section">
      <div className="container">
        <div className="section-header">
          <div className="section-header__content">
            <h2 className="section-title">Exclusive Offers</h2>
            <button className="view-all-btn">View All Offers →</button>
          </div>
          <p className="section-subtitle">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        <Carousel itemsPerView={3} gap={24}>
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-card__image">
                <img
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                />
                <div className="offer-card__overlay">
                  <div className="offer-card__discount">{offer.discount}</div>
                  <div className="offer-card__content">
                    <h3 className="offer-card__title">{offer.title}</h3>
                    <p className="offer-card__description">
                      {offer.description}
                    </p>
                    <button className="offer-card__cta">{offer.cta} →</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default ExclusiveOffers;
