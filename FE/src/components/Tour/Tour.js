import "./Tour.css"

export default function TravelWebsite() {
  return (
    <div className="travel-website">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1555400082-8dd4d78c670b?w=1200&h=400&fit=crop"
            alt="Ho Chi Minh City skyline"
            className="hero-image"
          />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-text">
                <h1 className="hero-title">Hơn 1000+ Tour, Khám Phá Ngay</h1>
                <p className="hero-subtitle">Gia tốt - Dễ dàng 24/7 - Khởi hành</p>
                <div className="hero-badge">TIẾT KIỆM ĐẾN TỪNG ĐỒN</div>
              </div>

              {/* Search Form */}
              <div className="search-form">
                <div className="search-grid">
                  <div className="search-field">
                    <span className="search-icon">📍</span>
                    <input type="text" placeholder="Bạn muốn đi đâu?" className="search-input" />
                  </div>
                  <div className="search-field">
                    <span className="search-icon">📅</span>
                    <input type="text" placeholder="Ngày khởi hành" className="search-input" />
                  </div>
                  <div className="search-field">
                    <span className="search-icon">📅</span>
                    <input type="text" placeholder="Khởi hành từ Hồ Chí Minh" className="search-input" />
                  </div>
                  <button className="search-button">Tìm</button>
                </div>
              </div>
            </div>

            <div className="hero-promo">
              <div className="promo-text">
                <div className="promo-line">TOUR TRONG NƯỚC SIÊU RẺ</div>
                <div className="promo-line">HCM - PHƯƠNG HẢI - HÀNG CHÂU</div>
                <div className="promo-line">TỪ CHƯA ĐẾN 10 TRIỆU - KHỞI HÀNH</div>
                <div className="promo-price">
                  Từ 5.199.000 <span className="price-unit">VNĐ/khách</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">1.000+ tours</div>
                <div className="stat-text">Chất lượng cao & giá tốt nhất</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🌍</div>
              <div className="stat-content">
                <div className="stat-number">100+ điểm đến 5 sao</div>
                <div className="stat-text">Trải nghiệm khách hàng cao cấp nhất</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-number">100+ ưu đãi mỗi ngày</div>
                <div className="stat-text">Ưu đãi hấp dẫn mỗi ngày, nhiều chọn lựa</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Tours */}
      <section className="recent-tours">
        <div className="container">
          <h2 className="section-title">Tours du lịch bạn đã xem gần đây</h2>
          <div className="recent-tours-grid">
            <div className="recent-tour-card">
              <div className="recent-tour-content">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=160&h=120&fit=crop"
                  alt="Tour Miền Bắc"
                  className="recent-tour-image"
                />
                <div className="recent-tour-info">
                  <h3 className="recent-tour-title">
                    Tour Miền Bắc 5N4Đ: HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long
                  </h3>
                  <div className="recent-tour-date">Khởi hành: 27 - Tháng giá</div>
                  <div className="recent-tour-price">5.790.000 đ</div>
                </div>
              </div>
            </div>
            <div className="recent-tour-card">
              <div className="recent-tour-content">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=160&h=120&fit=crop"
                  alt="Tour Phú Quốc"
                  className="recent-tour-image"
                />
                <div className="recent-tour-info">
                  <h3 className="recent-tour-title">Tour Phú Quốc 3N2Đ: HCM - Sunset Sanato - Cáp treo Hòn Thơm</h3>
                  <div className="recent-tour-date">Khởi hành: 15 - Tháng giá</div>
                  <div className="recent-tour-price">5.990.000 đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domestic Summer Tours */}
      <section className="summer-tours">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tour Du Lịch Hè Trong Nước</h2>
            <p className="section-subtitle">Thưa quý khách Phú, Giá đã bao gồm thuế</p>
          </div>

          <div className="tours-grid">
            {/* Tour Card 1 */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                  alt="Tour Quy Nhon"
                  className="tour-image"
                />
                <div className="tour-badge red">Giảm giá 15% hôm nay</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">
                  Tour Quy Nhon - Phú Yên 4N3Đ: Hà Nội - Kỳ Co Eo Gió Vịnh Xuân Đài - Ghềnh Đá Đĩa - Check in Eo Gió
                </h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 4 ngày 3 đêm</span>
                  </div>
                  <div className="tour-detail">
                    <span className="tour-icon">👥</span>
                    <span>Khởi hành từ Thành phố Hồ Chí Minh</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">6.690.000 đ</div>
                </div>
              </div>
            </div>

            {/* Tour Card 2 */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                  alt="Tour Lao Cai"
                  className="tour-image"
                />
                <div className="tour-badge red">Giảm giá 10% hôm nay</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Sa Lao Cai Tràng 3N2Đ: Khám phá Ruộng Bậc Thang - Phú Yên</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 2 đêm</span>
                  </div>
                  <div className="tour-detail">
                    <span className="tour-icon">👥</span>
                    <span>Khởi hành từ Hà Nội - Khởi hành từ Sài Gòn</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">4.290.000 đ</div>
                </div>
              </div>
            </div>

            {/* Tour Card 3 */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
                  alt="Tour Binh Hung"
                  className="tour-image"
                />
                <div className="tour-badge red">Ưu đãi đặc biệt</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Bình Hưng 3N2Đ: Ninh Chữ - Vĩnh Hy - Sơn Hà - Bình Hưng Island</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 2 đêm</span>
                  </div>
                  <div className="tour-detail">
                    <span className="tour-icon">👥</span>
                    <span>Khởi hành từ Thành phố Hồ Chí Minh</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">2.140.000 đ</div>
                </div>
              </div>
            </div>

            {/* Tour Card 4 */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop"
                  alt="Tour Mien Bac"
                  className="tour-image"
                />
                <div className="tour-badge red">Giảm giá 15% hôm nay</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Miền Bắc 5N4Đ: HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 5 ngày 4 đêm</span>
                  </div>
                  <div className="tour-detail">
                    <span className="tour-icon">👥</span>
                    <span>Khởi hành từ Thành phố Hồ Chí Minh</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">8.790.000 đ</div>
                </div>
              </div>
            </div>

            {/* Tour Card 5 */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                  alt="Tour Mien Trung"
                  className="tour-image"
                />
                <div className="tour-badge red">Giảm giá 10% hôm nay</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Miền Trung 4N3Đ: HCM - Đà Nẵng - Hội An - Huế - Quảng Bình</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 4 ngày 3 đêm</span>
                  </div>
                  <div className="tour-detail">
                    <span className="tour-icon">👥</span>
                    <span>Khởi hành từ Thành phố Hồ Chí Minh</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">6.990.000 đ</div>
                </div>
              </div>
            </div>

            {/* Tour Card 6 */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
                  alt="Tour Phu Quoc"
                  className="tour-image"
                />
                <div className="tour-badge red">Ưu đãi đặc biệt</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Phú Quốc 3N2Đ: HCM - Grand World - Cáp treo - Lặn ngắm San Hô</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 2 đêm</span>
                  </div>
                  <div className="tour-detail">
                    <span className="tour-icon">👥</span>
                    <span>Khởi hành từ Thành phố Hồ Chí Minh</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">4.990.000 đ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-footer">
            <button className="view-more-btn">Xem thêm tours</button>
          </div>
        </div>
      </section>

      {/* Central Vietnam Tours */}
      <section className="central-tours">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tour Du Lịch Miền Trung</h2>
            <p className="section-subtitle">Trải nghiệm thiên đường du lịch</p>
          </div>

          <div className="tours-grid">
            {/* Central Vietnam Tour Cards */}
            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                  alt="Tour Da Nang"
                  className="tour-image"
                />
                <div className="tour-badge red">Thưởng Cả Tuần Chỉ Chọn Tháng</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Đà Nẵng 3N2Đ: Chùa Quan Thế Âm - Phố Cổ Hội An - Cầu Vàng - Bà Nà</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 2 đêm</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">2.820.000 đ</div>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop"
                  alt="Tour Da Nang Ba Na"
                  className="tour-image"
                />
                <div className="tour-badge red">Vượt Ưu Đãi 5%</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">Tour Đà Nẵng 3N2Đ: HCM - Đà Nẵng - Hùng Dũa Bây Mẫu - Hội An - Bà Nà</h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 2 đêm</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">5.290.000 đ</div>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                  alt="Tour Quang Binh"
                  className="tour-image"
                />
                <div className="tour-badge red">Giảm Thưởng Khách Phá Vỡ Hạn Chế</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">
                  Tour Quảng Bình - Huế 3N1Đ (Đón tại Huế): Thành Phố La Vang - Động Phong Nha
                </h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 1 đêm</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">2.035.000 đ</div>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
                  alt="Tour Mien Trung Dragon Bridge"
                  className="tour-image"
                />
                <div className="tour-badge red">Khuyến Sản 5%</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">
                  Tour Miền Trung 5N4Đ (Đón tại Đà Nẵng): Bán Đảo Sơn Trà - Hội An - Bà Nà - Huế - Phong Nha
                </h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 5 ngày 4 đêm</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">4.170.000 đ</div>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
                  alt="Tour Mien Trung Hoi An"
                  className="tour-image"
                />
                <div className="tour-badge red">Khuyến Sản 10%</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">
                  Tour Miền Trung 4N3Đ (Đón tại Đà Nẵng): Khám Phá Sơn Trà - Hội An - Bà Nà - Huế
                </h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 4 ngày 3 đêm</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">3.135.000 đ</div>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-image-container">
                <img
                  src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop"
                  alt="Tour Da Nang Han Market"
                  className="tour-image"
                />
                <div className="tour-badge red">Khuyến Sản 5%</div>
              </div>
              <div className="tour-content">
                <h3 className="tour-title">
                  Tour Đà Nẵng 3N2Đ (Đón Tại Đà Nẵng): Bán Đảo Sơn Trà - Chợ Lao Chấm - Hội An - Bà Nà
                </h3>
                <div className="tour-info">
                  <div className="tour-detail">
                    <span className="tour-icon">🕒</span>
                    <span>Thời gian: 3 ngày 2 đêm</span>
                  </div>
                </div>
                <div className="tour-price-container">
                  <div className="tour-price">2.610.000 đ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-footer">
            <button className="view-more-btn">Xem thêm tours</button>
          </div>
        </div>
      </section>
    </div>
  )
}
