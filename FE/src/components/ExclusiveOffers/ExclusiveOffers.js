import Carousel from "../Carousel/Carousel";
import "./ExclusiveOffers.scss";

const ExclusiveOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Premium Downtown Package",
      description: "Enjoy a complimentary night and daily breakfast",
      discount: "20% OFF",
      image: "/placeholder.svg?height=200&width=300&text=Downtown+Package",
      cta: "View Offers",
    },
    {
      id: 2,
      title: "Weekend Island Package",
      description:
        "Special couple package with up to spa treatment at no additional cost",
      discount: "25% OFF",
      image: "/placeholder.svg?height=200&width=300&text=Island+Package",
      cta: "View Offers",
    },
    {
      id: 3,
      title: "Family Fun Staycation",
      description:
        "Book 60 days in advance and save up to 35% of any of our luxury providential suite",
      discount: "35% OFF",
      image: "/placeholder.svg?height=200&width=300&text=Family+Staycation",
      cta: "View Offers",
    },
    {
      id: 4,
      title: "Business Travel Deal",
      description:
        "Perfect for business travelers with meeting rooms and high-speed internet",
      discount: "15% OFF",
      image: "/placeholder.svg?height=200&width=300&text=Business+Deal",
      cta: "View Offers",
    },
    {
      id: 5,
      title: "Romantic Getaway",
      description: "Candlelit dinner, couples massage, and champagne included",
      discount: "30% OFF",
      image: "/placeholder.svg?height=200&width=300&text=Romantic+Getaway",
      cta: "View Offers",
    },
  ];

  return (
    <section className="exclusive-offers">
      <div className="container">
        <div className="section-header">
          <h2>Exclusive Offers</h2>
          <p>
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
          <a href="#" className="view-all-link">
            View All Offers →
          </a>
        </div>

        <Carousel itemsPerView={3} gap={32}>
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-image">
                <img
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                />
                <span className="discount-badge">{offer.discount}</span>
              </div>
              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <button className="btn btn-outline">{offer.cta} →</button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default ExclusiveOffers;