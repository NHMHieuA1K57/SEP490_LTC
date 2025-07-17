import Carousel from "../Carousel/Carousel";
import "./ExclusiveOffers.scss";

const ExclusiveOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Gói nghỉ dưỡng trung tâm cao cấp",
      description: "Tặng 1 đêm miễn phí và bữa sáng mỗi ngày",
      discount: "Giảm 20%",
      image: "/placeholder.svg?height=200&width=300&text=Gói+trung+tâm+cao+cấp",
      cta: "Xem ưu đãi",
    },
    {
      id: 2,
      title: "Gói cuối tuần trên đảo",
      description: "Ưu đãi cặp đôi, tặng liệu trình spa miễn phí",
      discount: "Giảm 25%",
      image: "/placeholder.svg?height=200&width=300&text=Cuối+tuần+trên+đảo",
      cta: "Xem ưu đãi",
    },
    {
      id: 3,
      title: "Kỳ nghỉ gia đình vui vẻ",
      description:
        "Đặt trước 60 ngày, tiết kiệm đến 35% cho phòng suite sang trọng",
      discount: "Giảm 35%",
      image: "/placeholder.svg?height=200&width=300&text=Gia+đình+vui+vẻ",
      cta: "Xem ưu đãi",
    },
    {
      id: 4,
      title: "Ưu đãi doanh nhân",
      description: "Phòng họp miễn phí, internet tốc độ cao cho khách công tác",
      discount: "Giảm 15%",
      image: "/placeholder.svg?height=200&width=300&text=Ưu+đãi+doanh+nhân",
      cta: "Xem ưu đãi",
    },
    {
      id: 5,
      title: "Kỳ nghỉ lãng mạn",
      description: "Bữa tối nến, massage đôi, tặng rượu vang cho cặp đôi",
      discount: "Giảm 30%",
      image: "/placeholder.svg?height=200&width=300&text=Lãng+mạn",
      cta: "Xem ưu đãi",
    },
  ];

  return (
    <section className="exclusive-offers">
      <div className="container">
        <div className="section-header">
          <h2>Ưu đãi đặc biệt</h2>
          <p>
            Đừng bỏ lỡ các ưu đãi giới hạn và gói khuyến mãi hấp dẫn để kỳ nghỉ
            của bạn thêm trọn vẹn.
          </p>
          <a href="#" className="view-all-link">
            Xem tất cả ưu đãi →
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
