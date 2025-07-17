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
              Khám phá những khách sạn và chỗ nghỉ tuyệt vời nhất, mang đến trải
              nghiệm đáng nhớ cho mọi chuyến đi của bạn.
            </p>
            <div className="footer__social">
              <a href="#" className="social-link" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                🐦
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                💼
              </a>
            </div>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h4 className="footer__heading">Về chúng tôi</h4>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Truyền thông
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Hỗ trợ</h4>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    An toàn
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Chính sách hủy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Hỗ trợ tiếp cận
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__column">
              <h4 className="footer__heading">Nhận thông tin mới</h4>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Đăng ký nhận bản tin du lịch
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Ưu đãi & mẹo du lịch độc quyền
                  </a>
                </li>
              </ul>
              <div className="footer__newsletter">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="newsletter-input"
                />
                <button className="newsletter-btn" aria-label="Đăng ký">
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>© 2024 QuickStay. Đã đăng ký bản quyền.</p>
          </div>
          <div className="footer__legal">
            <a href="#" className="footer__link">
              Chính sách bảo mật
            </a>
            <a href="#" className="footer__link">
              Điều khoản
            </a>
            <a href="#" className="footer__link">
              Sơ đồ trang
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
