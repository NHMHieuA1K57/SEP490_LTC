import React, { useState } from "react";
import "./Header.scss";

const Header = ({ onLogoClick, onViewBookings, onViewRooms }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div
            className="header__logo"
            onClick={onLogoClick}
            style={{ cursor: "pointer" }}
          >
            <span className="logo-icon">🏨</span>
            <span className="logo-text">QuickStay</span>
          </div>

          <nav
            className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}
          >
            <a href="#home" className="nav-link nav-link--active">
              Home
            </a>
            <a href="#hotels" className="nav-link" onClick={onViewRooms}>
              Hotels
            </a>
            <a href="#experiences" className="nav-link">
              Experiences
            </a>
            <a href="#about" className="nav-link" onClick={onViewBookings}>
              About
            </a>
          </nav>

          <div className="header__actions">
            <button className="search-btn">🔍</button>
            <button className="profile-btn">👤</button>
            <button className="btn btn-primary">Login</button>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
