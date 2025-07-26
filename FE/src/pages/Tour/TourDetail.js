"use client"

import { useState } from "react"
import "./TourDetail.css"

const TourDetail = () => {
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const tourImages = [
    "/placeholder.svg?height=80&width=80",
    "/placeholder.svg?height=80&width=80",
    "/placeholder.svg?height=80&width=80",
    "/placeholder.svg?height=80&width=80",
    "/placeholder.svg?height=80&width=80",
    "/placeholder.svg?height=80&width=80",
    "/placeholder.svg?height=80&width=80",
  ]

  const scheduleData = [
    {
      departure: "T6, 26/07/2025",
      return: "CN, 27/07/2025",
      status: "Liên hệ",
      price: "6.090.000 đ",
      statusClass: "status-contact",
    },
    {
      departure: "T7, 26/07/2025",
      return: "T2, 28/07/2025",
      status: "Liên hệ",
      price: "6.590.000 đ",
      statusClass: "status-contact",
    },
    {
      departure: "CN, 27/07/2025",
      return: "T3, 29/07/2025",
      status: "Còn 2 chỗ",
      price: "6.290.000 đ",
      statusClass: "status-available",
    },
    {
      departure: "T6, 01/08/2025",
      return: "CN, 03/08/2025",
      status: "Còn 1 chỗ",
      price: "6.590.000 đ",
      statusClass: "status-limited",
    },
    {
      departure: "CN, 03/08/2025",
      return: "T3, 05/08/2025",
      status: "Còn 17 chỗ",
      price: "5.990.000 đ",
      statusClass: "status-available",
    },
  ]

  const relatedTours = [
    {
      title: "Tour Cano 3 Đảo Phú Quốc Trong Ngày: Cano Hòn Mây Rút - Hòn Móng Tay - Gầm Ghì",
      duration: "1 ngày",
      rating: "Tuyệt vời | 2 đánh giá",
      price: "744.000 đ",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tour Phú Quốc 3N2Đ: Grand World - 4 Đảo - Ngắm San Hô - Hòn Thơm",
      duration: "4 ngày",
      rating: "Tuyệt vời | 4 đánh giá",
      price: "3.750.000 đ",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tour Phú Quốc 3N2Đ: Grand World - Thị Trấn Hoàng Hôn - Cáp Treo Hòn Thơm",
      duration: "3 ngày",
      rating: "Tuyệt vời | 25 đánh giá",
      price: "5.690.000 đ",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const relatedTours2 = [
    {
      title: "Tour Phú Quốc 3N2Đ: HCM - Grand World - Cáp Cầu - Làng Nghề San Hô",
      duration: "3 ngày",
      rating: "Tuyệt vời | 10 đánh giá",
      price: "5.990.000 đ",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tour Phú Quốc 3N4Đ: HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long",
      duration: "7 ngày",
      rating: "Tuyệt vời | 27 đánh giá",
      price: "9.290.000 đ",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tour Phú Quốc 3N2Đ: HCM - Phú Quốc - KDL Hòn Thơm - Grand World",
      duration: "3 ngày",
      rating: "Hài lòng | 2 đánh giá",
      price: "7.890.000 đ",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="phu-quoc-tour">
      <div className="container">
        {/* Tour Title */}
        <div className="tour-header">
          <h1 className="tour-title">Tour Phú Quốc 3N2Đ: HCM - Phú Quốc - KDL Hòn Thơm - Grand World</h1>
          <div className="rating-badge">
            <span className="star">★</span>
            Đã có 2 đánh giá
          </div>
        </div>

        <div className="main-content">
          {/* Left Content */}
          <div className="content-left">
            {/* Main Image */}
            <div className="image-section">
              <img src="/placeholder.svg?height=400&width=600" alt="Phú Quốc Beach" className="main-image" />

              {/* Thumbnail Images */}
              <div className="thumbnail-container">
                {tourImages.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Tour image ${index + 1}`}
                    className="thumbnail"
                  />
                ))}
              </div>
            </div>

            {/* Tour Info */}
            <div className="card tour-info">
              <div className="tour-info-header">
                <div className="departure-info">
                  <span className="icon">📍</span>
                  <span>Khởi hành từ: Hồ Chí Minh</span>
                </div>
                <div className="tour-code">Mã Tour: TO1619</div>
              </div>

              <h3 className="section-title">Tour Trọn Gói bao gồm</h3>
              <div className="tour-includes">
                <div>Vé máy bay</div>
                <div>Khách sạn 3*</div>
                <div>Hướng dẫn viên</div>
                <div>Bảo hiểm du lịch</div>
              </div>
            </div>

            {/* Tour Experience */}
            <div className="card">
              <h3 className="section-title">Trải nghiệm thú vị trong tour</h3>
              <ul className="experience-list">
                <li>- Thưởng thức hải sản tươi ngon, đặc sản nổi tiếng của đảo ngọc</li>
                <li>- Phiêu lưu tại VinWonders và Safari: thỏa thích giải trí và đồng vui hoàng gia</li>
                <li>- Tham quan cánh đồng bao trọn khu Hòn Thơm và khám phá vẻ đẹp tại Aquatopia</li>
                <li>- Check-in Sunset Town: ngắm hoàng hôn tuyệt đẹp và chiêm ngưỡng cầu Hôn bắc ngang</li>
                <li>
                  - Khám phá Grand World: thành phố không ngủ với giải Venice bao gồm phố Tàu, và chùa Tịnh Hòa Việt Nam
                </li>
              </ul>
            </div>

            {/* Tour Program */}
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">Chương trình tour</h3>
                <span className="view-all">Xem tất cả</span>
              </div>

              <div className="program-list">
                <div className="program-item">
                  <img src="/placeholder.svg?height=60&width=60" alt="Day 1" className="program-image" />
                  <div className="program-content">
                    <div className="program-day">Ngày 1</div>
                    <div className="program-description">HCM - Phú Quốc - Grand World (Ăn Trưa)</div>
                  </div>
                </div>

                <div className="program-item">
                  <img src="/placeholder.svg?height=60&width=60" alt="Day 2" className="program-image" />
                  <div className="program-content">
                    <div className="program-day">Ngày 2</div>
                    <div className="program-description">Hòn Thơm/Cano 4 Đảo - Sunset Town (Ăn Sáng, Trưa, Tối)</div>
                  </div>
                </div>

                <div className="program-item">
                  <img src="/placeholder.svg?height=60&width=60" alt="Day 3" className="program-image" />
                  <div className="program-content">
                    <div className="program-day">Ngày 3</div>
                    <div className="program-description">Mua Sắm - Chợ Tây Phú Quốc (Ăn Sáng, Trưa)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">Lịch khởi hành & giá tour</h3>
                <span className="date-info">28/3/2025</span>
              </div>

              <div className="table-container">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Ngày khởi hành</th>
                      <th>Ngày về</th>
                      <th>Tình trạng chỗ</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.departure}</td>
                        <td>{row.return}</td>
                        <td>
                          <span className={row.statusClass}>{row.status}</span>
                        </td>
                        <td className="price-cell">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="view-more">
                <span className="view-more-link">Xem thêm</span>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="content-right">
            <div className="booking-card">
              <h3 className="booking-title">Lịch Trình và Giá Tour</h3>

              <div className="date-selection">
                <label className="date-label">Chọn Lịch Trình và Ngày Giờ</label>
                <div className="date-buttons">
                  <button className="date-btn">26/07</button>
                  <button className="date-btn">26/07</button>
                  <button className="date-btn">27/07</button>
                  <button className="date-btn active">Tất cả</button>
                </div>
              </div>

              <div className="passenger-selection">
                <div className="passenger-row">
                  <span className="passenger-label">Người lớn</span>
                  <div className="passenger-controls">
                    <span className="passenger-price">6.590.000đ</span>
                    <div className="counter">
                      <button className="counter-btn" onClick={() => setAdults(Math.max(1, adults - 1))}>
                        -
                      </button>
                      <span className="counter-value">{adults}</span>
                      <button className="counter-btn" onClick={() => setAdults(adults + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="passenger-row">
                  <span className="passenger-label">Trẻ em</span>
                  <div className="passenger-controls">
                    <span className="passenger-age">5-11 tuổi</span>
                    <div className="counter">
                      <button className="counter-btn" onClick={() => setChildren(Math.max(0, children - 1))}>
                        -
                      </button>
                      <span className="counter-value">{children}</span>
                      <button className="counter-btn" onClick={() => setChildren(children + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="passenger-row">
                  <span className="passenger-label">Trẻ nhỏ</span>
                  <div className="passenger-controls">
                    <span className="passenger-age">{"< 5 tuổi"}</span>
                    <div className="counter">
                      <button className="counter-btn" onClick={() => setInfants(Math.max(0, infants - 1))}>
                        -
                      </button>
                      <span className="counter-value">{infants}</span>
                      <button className="counter-btn" onClick={() => setInfants(infants + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-info">Liên hệ để xác nhận chỗ</div>

              <div className="price-summary">
                <div className="price-row">
                  <span>Giá gốc</span>
                  <span>13.780.000đ</span>
                </div>
                <div className="price-row total">
                  <span>Tổng giá Tour</span>
                  <span>13.180.000đ</span>
                </div>

                <button className="book-btn">Yêu cầu đặt</button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        <div className="related-tours">
          <h2 className="related-title">Tours du lịch Phú Quốc liên quan</h2>

          <div className="tour-grid">
            {relatedTours.map((tour, index) => (
              <div key={index} className="tour-card">
                <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="tour-image" />
                <div className="tour-content">
                  <div className="tour-rating">
                    <span className="star">★</span>
                    {tour.rating}
                  </div>
                  <h3 className="tour-card-title">{tour.title}</h3>
                  <div className="tour-features">• Hòn Gầm Ghì • Hòn Mây Rút • Quay Phim</div>
                  <div className="tour-price">{tour.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tour-grid">
            {relatedTours2.map((tour, index) => (
              <div key={index} className="tour-card">
                <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="tour-image" />
                <div className="tour-content">
                  <div className="tour-rating">
                    <span className="star">★</span>
                    {tour.rating}
                  </div>
                  <h3 className="tour-card-title">{tour.title}</h3>
                  <div className="tour-features">• Grand World • Aquatopia • Sunset Town</div>
                  <div className="tour-price">{tour.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetail
