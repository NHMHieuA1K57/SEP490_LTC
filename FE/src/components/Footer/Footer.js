import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="logo-icon">🏨</span>
              <span className="logo-text">QuickStay</span>
            </div>
            <p className="footer__description">
              Discover the world's finest accommodations designed to create
              unforgettable experiences that last a lifetime.
            </p>
            <div className="footer__social">
              <a href="#" className="social-link">
                📘
              </a>
              <a href="#" className="social-link">
                📷
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
              <a href="#" className="social-link">
                💼
              </a>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Company</h4>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Support</h4>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Cancellation Options
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Stay Updated</h4>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Subscribe to our newsletter for travel
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    tips and exclusive offers
                  </a>
                </li>
              </ul>
              <div className="footer__newsletter">
                <input
                  type="email"
                  placeholder="Your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">→</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>© 2024 QuickStay. All rights reserved.</p>
          </div>
          <div className="footer__legal">
            <a href="#" className="footer__link">
              Privacy
            </a>
            <a href="#" className="footer__link">
              Terms
            </a>
            <a href="#" className="footer__link">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
