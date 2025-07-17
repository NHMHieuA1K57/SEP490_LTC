import React from "react";
import Carousel from "../Carousel/Carousel";
import "./FavoriteDestinations.scss";

const destinations = [
  {
    name: "Hạ Long",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // Vịnh Hạ Long
    description:
      "Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới, nổi tiếng với hàng nghìn đảo đá và hang động tuyệt đẹp.",
    location: "Quảng Ninh",
  },
  {
    name: "Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80", // Cầu Rồng Đà Nẵng
    description:
      "Thành phố biển năng động, nổi bật với cầu Rồng, bãi biển Mỹ Khê và Bà Nà Hills.",
    location: "Đà Nẵng",
  },
  {
    name: "Sa Pa",
    image:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80", // Ruộng bậc thang Sa Pa
    description:
      "Thị trấn mờ sương, ruộng bậc thang tuyệt đẹp, văn hóa dân tộc đặc sắc.",
    location: "Lào Cai",
  },
  {
    name: "Phú Quốc",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", // Biển Phú Quốc
    description:
      "Đảo ngọc nổi tiếng với biển xanh, cát trắng, resort sang trọng và hải sản tươi ngon.",
    location: "Kiên Giang",
  },
  {
    name: "Hội An",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", // Phố cổ Hội An
    description:
      "Phố cổ Hội An - Di sản văn hóa thế giới, lung linh đèn lồng, ẩm thực phong phú.",
    location: "Quảng Nam",
  },
  {
    name: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", // Biển Nha Trang
    description:
      "Thành phố biển nổi tiếng với bãi biển dài, Vinpearl Land và các hòn đảo tuyệt đẹp.",
    location: "Khánh Hòa",
  },
  {
    name: "Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a?auto=format&fit=crop&w=600&q=80", // Thung lũng Đà Lạt
    description:
      "Thành phố ngàn hoa, khí hậu mát mẻ quanh năm, nhiều điểm check-in lãng mạn.",
    location: "Lâm Đồng",
  },
  {
    name: "Huế",
    image:
      "https://images.unsplash.com/photo-1465101053361-7630c1c47054?auto=format&fit=crop&w=600&q=80", // Kinh thành Huế
    description:
      "Cố đô Huế - Di sản văn hóa thế giới, nổi tiếng với Đại Nội, lăng tẩm và ẩm thực cung đình.",
    location: "Thừa Thiên Huế",
  },
  {
    name: "Côn Đảo",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80", // Biển Côn Đảo
    description:
      "Quần đảo hoang sơ, biển xanh trong, di tích lịch sử và thiên nhiên kỳ thú.",
    location: "Bà Rịa - Vũng Tàu",
  },
  {
    name: "Mộc Châu",
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80", // Đồi chè Mộc Châu
    description:
      "Cao nguyên xanh mát, đồi chè, hoa cải, hoa mận nở trắng trời mỗi độ xuân về.",
    location: "Sơn La",
  },
  {
    name: "Cần Thơ",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", // Chợ nổi Cần Thơ
    description:
      "Thủ phủ miền Tây, nổi tiếng với chợ nổi Cái Răng, vườn trái cây và ẩm thực sông nước.",
    location: "Cần Thơ",
  },
  {
    name: "Vũng Tàu",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", // Biển Vũng Tàu
    description:
      "Thành phố biển gần Sài Gòn, bãi biển đẹp, hải sản tươi ngon, nhiều điểm vui chơi giải trí.",
    location: "Bà Rịa - Vũng Tàu",
  },
];

const FavoriteDestinations = () => {
  return (
    <section className="favorite-destinations section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Các điểm đến yêu thích</h2>
          <p className="section-subtitle">
            Khám phá những địa điểm du lịch nổi bật nhất Việt Nam được nhiều du
            khách lựa chọn.
          </p>
        </div>
        <Carousel itemsPerView={5} gap={24}>
          {destinations.map((dest, idx) => (
            <div className="destination-card" key={idx}>
              <div className="destination-card__image">
                <img src={dest.image} alt={dest.name} />
              </div>
              <div className="destination-card__body">
                <h3 className="destination-card__name">{dest.name}</h3>
                <span className="destination-card__location">
                  {dest.location}
                </span>
                <p className="destination-card__desc">{dest.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default FavoriteDestinations;
