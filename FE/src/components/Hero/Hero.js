import React, { useState, useRef } from "react";

import "./Hero.scss";

function getTomorrow() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().slice(0, 10);
}

// Hàm lấy ngày hôm nay dạng yyyy-MM-dd
function getToday() {
  const t = new Date();
  return t.toISOString().slice(0, 10);
}

const Hero = () => {
  const [activeTab, setActiveTab] = useState("hotel");
  const [checkIn, setCheckIn] = useState(getTomorrow());
  const [checkOut, setCheckOut] = useState(getTomorrow());
  const [destination, setDestination] = useState("");
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 1,
    children: 0,
  });
  const guestRef = useRef();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý search
    console.log({ destination, checkIn, checkOut, guests });
  };

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGuestChange = (type, delta) => {
    setGuests((prev) => {
      let value = prev[type] + delta;
      if (value < 0) value = 0;
      if (type === "rooms" && value < 1) value = 1;
      if (type === "adults" && value < 1) value = 1;
      return { ...prev, [type]: value };
    });
  };

  return (
    <section className="hero">
      <div className="hero__background">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
          alt="Luxury resort with pool and palm trees"
          className="hero__image"
        />
        <div className="hero__overlay"></div>
      </div>

      <div className="container">
        <div className="hero__content">
          <div className="hero__badge">Trải nghiệm khách sạn tuyệt vời</div>

          <h1 className="hero__title">
            Khám phá điểm đến lý tưởng
            <br />
            cho kỳ nghỉ của bạn
          </h1>

          <p className="hero__subtitle">
            Đẳng cấp và tiện nghi vượt trội tại những khách sạn hàng đầu.
            <br />
            Bắt đầu hành trình của bạn cùng chúng tôi ngay hôm nay.
          </p>

          {/* Tabs Form riêng */}
          <div className="hero__tab-wrapper">
            <form
              className="hero__tabs-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <button
                type="button"
                className={activeTab === "hotel" ? "active" : ""}
                onClick={() => setActiveTab("hotel")}
              >
                Khách sạn
              </button>
              <button
                type="button"
                className={activeTab === "activity" ? "active" : ""}
                onClick={() => setActiveTab("activity")}
              >
                Hoạt động
              </button>
              <button
                type="button"
                className={activeTab === "other" ? "active" : ""}
                onClick={() => setActiveTab("other")}
              >
                Khác
              </button>
            </form>
          </div>

          {/* Search form */}
          <div className="hero__search-wrapper">
            {activeTab === "hotel" && (
              <form className="hero__search" onSubmit={handleSearch}>
                {/* Phần trên: thanh search lớn */}
                <div className="search-row search-row-top">
                  <div className="input-icon-group">
                    <input
                      className="destination-input"
                      type="text"
                      placeholder="Nhập điểm đến hoặc tên khách sạn"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                    <span className="input-icon">🔍</span>
                  </div>
                </div>

                {/* Phần dưới: 2 cột */}
                <div className="search-row search-row-bottom">
                  <div className="search-col search-col-left">
                    <div className="date-input-group">
                      <div className="input-icon-group">
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="date-input"
                          placeholder="Ngày nhận phòng"
                          min={getToday()}
                        />
                        <span className="input-icon">📅</span>
                      </div>
                      <span className="date-sep">→</span>
                      <div className="input-icon-group">
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="date-input"
                          placeholder="Ngày trả phòng"
                          min={checkIn || getToday()}
                        />
                        <span className="input-icon">📅</span>
                      </div>
                    </div>
                  </div>
                  <div className="search-col search-col-right">
                    <div className="input-icon-group">
                      <span className="input-icon">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#007bff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
                        </svg>
                      </span>
                      <div className="guest-field" ref={guestRef}>
                        <div
                          className="guest-input"
                          onClick={() => setShowGuestDropdown((v) => !v)}
                          tabIndex={0}
                        >
                          {guests.rooms} phòng, {guests.adults} người lớn
                          {guests.children > 0
                            ? `, ${guests.children} trẻ em`
                            : ""}
                        </div>
                        {showGuestDropdown && (
                          <div className="guest-dropdown">
                            <div className="guest-row">
                              <span>Phòng</span>
                              <div className="guest-controls">
                                <button
                                  type="button"
                                  onClick={() => handleGuestChange("rooms", -1)}
                                >
                                  -
                                </button>
                                <span>{guests.rooms}</span>
                                <button
                                  type="button"
                                  onClick={() => handleGuestChange("rooms", 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="guest-row">
                              <span>Người lớn</span>
                              <div className="guest-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleGuestChange("adults", -1)
                                  }
                                >
                                  -
                                </button>
                                <span>{guests.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => handleGuestChange("adults", 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="guest-row">
                              <span>Trẻ em</span>
                              <div className="guest-controls">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleGuestChange("children", -1)
                                  }
                                >
                                  -
                                </button>
                                <span>{guests.children}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleGuestChange("children", 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút search */}
                <div className="search-row search-row-btn">
                  <button type="submit" className="search-btn">
                    Tìm kiếm
                  </button>
                </div>
              </form>
            )}
            {/* Có thể bổ sung form cho các tab khác nếu cần */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
