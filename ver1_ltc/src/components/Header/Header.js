import { Link, useLocation } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🏨</span>
            <span className="logo-text">QuickStay</span>
          </Link>

          <nav className="nav">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/hotels"
              className={`nav-link ${
                location.pathname === "/hotels" ? "active" : ""
              }`}
            >
              Hotels
            </Link>
            <Link to="#" className="nav-link">
              Destination
            </Link>
            <Link to="#" className="nav-link">
              Experiences
            </Link>
            <Link to="#" className="nav-link">
              About
            </Link>
          </nav>

          <div className="header-actions">
            <button className="icon-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <Link to="/bookings" className="icon-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
            <Link to="/login" className="btn btn-dark">
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
