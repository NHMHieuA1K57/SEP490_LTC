import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]); // cập nhật khi route thay đổi

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

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
          {!user ? (
            <>
              <Link to="/login" className="btn btn-dark">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-light">
                Đăng ký
              </Link>
            </>
          ) : (
            <div
              className="user-dropdown-wrapper"
              style={{ position: "relative" }}
            >
              <button
                className="user-btn"
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  border: "none",
                  background: "#fff",
                  borderRadius: 8,
                  padding: "8px 18px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onClick={() => setShowUserDropdown((v) => !v)}
                onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
              >
                <span style={{ marginRight: 6 }}>
                  {user.name || user.email || "User"}
                </span>
                <i className="fas fa-chevron-down" style={{ fontSize: 14 }}></i>
              </button>
              {showUserDropdown && (
                <div
                  className="user-dropdown-menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    background: "#fff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    borderRadius: 10,
                    minWidth: 220,
                    zIndex: 1002,
                    padding: "8px 0",
                  }}
                >
                  <Link
                    to="/account"
                    className="user-dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Hồ sơ của tôi
                  </Link>
                  <Link
                    to="/bookings"
                    className="user-dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Đơn đặt chỗ
                  </Link>
                  <Link
                    to="/messages"
                    className="user-dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Tin nhắn từ chỗ nghỉ
                  </Link>
                  <div
                    className="user-dropdown-item"
                    style={{
                      ...dropdownItemStyle,
                      color: "#1976d2",
                      fontWeight: 700,
                    }}
                  >
                    Tiền LTC 0 ₫
                  </div>
                  <Link
                    to="/wishlist"
                    className="user-dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Danh sách yêu thích
                  </Link>
                  <Link
                    to="/reviews"
                    className="user-dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Nhận xét của tôi
                  </Link>
                  <div
                    className="user-dropdown-item"
                    style={{
                      ...dropdownItemStyle,
                      color: "#e53935",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

// Thêm style cho dropdown item
const dropdownItemStyle = {
  padding: "10px 24px",
  color: "#222",
  fontSize: 16,
  fontWeight: 500,
  textDecoration: "none",
  background: "none",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  transition: "background 0.18s, color 0.18s",
  whiteSpace: "nowrap",
  display: "block",
};
