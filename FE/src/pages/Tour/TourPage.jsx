"use client"

import { useState } from "react"
import "./TourPage.css"

const TourPage = () => {
  const [selectedSort, setSelectedSort] = useState("Ưu đãi tốt nhất")

  const tours = Array(5)
    .fill({
      id: 1,
      title: "Tour Phú Quốc 3N2Đ: HCM - Phú Quốc - KDL Hòn Thơm - Grand World",
      rating: "9.0",
      reviews: "2 đánh giá",
      duration: "3 Ngày 2 Đêm",
      date: "25-07-2025",
      originalPrice: "7.000.000 đ",
      currentPrice: "6.090.000 đ",
      image: "/phu-quoc-aerial.jpg",
    })
    .map((tour, index) => ({ ...tour, id: index + 1 }))

  const sidebarItems = [
    {
      title: "Tour HOT Trong Nước",
      items: ["Đà Nẵng", "Hạ Long", "Sapa", "Quy Nhon", "Phú Yên", "Nha Trang"],
    },
    {
      title: "Loại Tours",
      items: ["Tour Trọn Gói", "Tour Trong Ngày", "Tour Siêu Du Thuyền"],
    },
    {
      title: "Tours Theo Chủ Đề",
      items: [
        "Tour Ưu Đãi Tốt Nhất Hôm Nay",
        "Tour Du Lịch Đông Tây Bắc",
        "Tour Du Lịch Trải Nghiệm Địa Phương",
        "Tour Du Lịch Độc Đáo",
        "Tour Du Lịch Nước Ngoài Cao Cấp",
        "Tour Du Lịch Nội Địa",
      ],
    },
  ]

  const handleTourClick = (tourId) => {
    console.log(`Xem tour ${tourId}`)
    // Có thể navigate đến trang chi tiết tour
  }

  const handleSearch = () => {
    console.log("Tìm kiếm tour")
  }

  return (
    <div className="phu-quoc-tours">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-fields">
            <div className="search-field">
              <div className="search-icon">🔍</div>
              <div className="search-content">
                <div className="search-title">Phú Quốc</div>
                <div className="search-subtitle">14 Tours</div>
              </div>
            </div>
            <div className="search-field">
              <div className="search-icon">📅</div>
              <div className="search-content">
                <div className="search-title">Ngày khởi hành</div>
                <div className="search-subtitle">Linh hoạt</div>
              </div>
            </div>
            <div className="search-field">
              <div className="search-icon">👥</div>
              <div className="search-content">
                <div className="search-title">Khối hành tự</div>
                <div className="search-subtitle">Tất cả</div>
              </div>
            </div>
            <button className="search-btn" onClick={handleSearch}>
              Tìm
            </button>
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="content-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            {sidebarItems.map((section, index) => (
              <div key={index} className="sidebar-section">
                <h3 className="sidebar-title">{section.title}</h3>
                <ul className="sidebar-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="sidebar-item">
                      <a href="#" className="sidebar-link">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                {index < sidebarItems.length - 1 && (
                  <div className="sidebar-more">
                    <a href="#" className="more-link">
                      Xem thêm
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="content-header">
              <h1 className="page-title">Tour du lịch Phú Quốc</h1>
              <p className="page-description">
                Tận hưởng Phú Quốc: Bãi Sao, Vinpearl Safari, chợ đêm Dinh Cậu. Trải nghiệm bãi biển tuyệt đẹp, ẩm thực
                hải sản tươi ngon và văn hóa địa phương!
              </p>
              <div className="content-controls">
                <div className="tour-count">Tổng cộng 14 Tour</div>
                <div className="sort-controls">
                  <span className="sort-label">Sắp xếp theo:</span>
                  <div className="sort-dropdown">
                    <button className="sort-btn">
                      {selectedSort}
                      <span className="dropdown-icon">▼</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Cards */}
            <div className="tour-list">
              {tours.map((tour) => (
                <div key={tour.id} className="tour-card">
                  <div className="tour-image">
                    <img src="/placeholder.svg?height=200&width=320" alt="Phu Quoc aerial view" />
                  </div>
                  <div className="tour-content">
                    <div className="tour-info">
                      <h3 className="tour-title">{tour.title}</h3>
                      <div className="tour-meta">
                        <div className="rating-badge">
                          {tour.rating} Rất tốt | {tour.reviews}
                        </div>
                      </div>
                      <div className="tour-duration">
                        <span className="duration-icon">🕒</span>
                        {tour.duration}
                      </div>
                    </div>
                    <div className="tour-booking">
                      <div className="tour-date">{tour.date}</div>
                      <div className="tour-price">
                        <div className="original-price">{tour.originalPrice}</div>
                        <div className="current-price">{tour.currentPrice}</div>
                      </div>
                      <button className="book-btn" onClick={() => handleTourClick(tour.id)}>
                        Xem Tour
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="load-more">
              <button className="load-more-btn">Xem thêm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourPage
