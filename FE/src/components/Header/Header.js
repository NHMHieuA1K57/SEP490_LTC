import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🏨</span>
          <span className="logo-text">QuickStay</span>
        </Link>

        <nav className="nav">
          <Link
            to="/hotels"
            className={`nav-link ${
              location.pathname === "/hotels" ? "active" : ""
            }`}
          >
            Khách sạn
          </Link>
          <Link
            to="/tours"
            className={`nav-link ${
              location.pathname === "/tours" ? "active" : ""
            }`}
          >
            Tour
          </Link>
          <div
            className="nav-link dropdown"
            onMouseEnter={() => setShowTransportDropdown(true)}
            onMouseLeave={() => setShowTransportDropdown(false)}
            tabIndex={0}
            onFocus={() => setShowTransportDropdown(true)}
            onBlur={() => setShowTransportDropdown(false)}
          >
            Phương tiện di chuyển
            <div
              className={`dropdown-menu${showTransportDropdown ? " show" : ""}`}
            >
              <Link to="#" className="dropdown-item">
                Vé máy bay
              </Link>
              <Link to="#" className="dropdown-item">
                Xe buýt
              </Link>
              <Link to="#" className="dropdown-item">
                Tàu hỏa
              </Link>
              <Link to="#" className="dropdown-item">
                Taxi
              </Link>
              <Link to="#" className="dropdown-item">
                Thuyền
              </Link>
            </div>
          </div>
          <Link to="#" className="nav-link">
            Hoạt động
          </Link>
          <Link to="#" className="nav-link">
            Phiếu giảm giá
          </Link>
          <Link to="#" className="nav-link">
            Cẩm nang du lịch
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-dark">
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-light">
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
