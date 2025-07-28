import React, { useEffect, useState } from "react";
import "./Account.scss";

const getInitial = (email) => (email ? email[0].toUpperCase() : "U");

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);
  const email = user?.email || "";

  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const name = user?.name || "abc";
  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar */}
        <div className="account-sidebar">
          <ul>
            <li>Đơn đặt chỗ của tôi</li>
            <li>Tin nhắn từ chỗ nghỉ</li>
            <li>Nhận xét</li>
            <li>Tiền LTC</li>
            <li>Hồ sơ</li>
          </ul>
        </div>
        {/* Main Content */}
        <div className="account-main">
          <h2>Thông tin người dùng</h2>
          <section className="account-info-row account-info-avatar-row">
            {!editingName ? (
              <>
                <div className="account-avatar-icon">{getInitial(email)}</div>
                <div className="account-info-avatar-content">
                  <div className="account-info-label account-info-label-inline">
                    Họ & Tên
                  </div>
                  <div className="account-info-name">{name}</div>
                </div>
                <span
                  className="edit-name-btn"
                  onClick={() => {
                    // Nếu user có name, tách thành họ và tên
                    const parts = name.split(" ");
                    setLastName(parts[0] || "");
                    setFirstName(parts.slice(1).join(" ") || "");
                    setEditingName(true);
                  }}
                >
                  Chỉnh sửa
                </span>
              </>
            ) : (
              <form
                className="edit-name-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEditingName(false);
                }}
              >
                <label htmlFor="lastName">Họ</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label htmlFor="firstName">Tên</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div className="edit-name-form-actions">
                  <button type="button" onClick={() => setEditingName(false)}>
                    Hủy
                  </button>
                  <button type="submit">Lưu</button>
                </div>
              </form>
            )}
          </section>
          <section className="account-info-row account-info-row-email">
            <div className="account-info-label account-info-label-inline">
              Email
            </div>
            <div className="account-info-email-row">
              <span className="account-info-email-main">{email}</span>
              <span className="verified">
                <i className="fas fa-check-circle verified-icon"></i> Đã xác
                nhận
              </span>
            </div>
          </section>
          <section className="account-info-row account-info-row-phone">
            <div className="account-info-label account-info-label-inline">
              Số điện thoại
            </div>
            <div className="account-info-phone-content">
              <div className="account-info-phone-value">
                {user?.phone || "Chưa cập nhật"}
              </div>
              <span className="edit-phone-btn">
                {user?.phone ? "Chỉnh sửa" : "Thêm"}
              </span>
            </div>
          </section>
          <section className="account-info-row account-info-row-password">
            <div className="account-info-label account-info-label-inline">
              Mật khẩu
            </div>
            <div className="account-info-password-content">
              <div className="account-info-password-value">********</div>
              <span className="edit-password-btn">Chỉnh sửa</span>
            </div>
          </section>

          <div className="account-info-label account-info-label-large">
            Phương thức thanh toán
          </div>
          <section className="account-info-row">
            <div className="account-info-label">
              Lưu thông tin thẻ tín dụng của tôi
            </div>
            <div className="account-info-value">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </section>

          <div className="account-info-label account-info-label-large">
            Đăng ký nhận thư điện tử
          </div>

          <section className="account-info-row account-info-row-newsletter">
            <div className="account-info-label account-info-label-newsletter">
              <b>Bản tin</b>
            </div>
            <div className="account-info-value account-info-value-newsletter">
              <div className="newsletter-radio-group">
                <label>
                  <input type="radio" name="newsletter" /> Hàng ngày
                </label>
                <label>
                  <input type="radio" name="newsletter" /> Hai ngày một lần
                </label>
                <label>
                  <input type="radio" name="newsletter" /> Hàng tuần
                </label>
                <label>
                  <input type="radio" name="newsletter" /> Không bao giờ
                </label>
              </div>
            </div>
          </section>
          <section className="account-info-row">
            <div className="account-info-label">
              Tôi muốn nhận thông tin nhắc hỗ trợ đặt phòng
            </div>
            <div className="account-info-value">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </section>
          <section className="account-info-row">
            <div className="account-info-label">
              Tôi muốn nhận email về khuyến mãi LTC.
            </div>
            <div className="account-info-value">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </section>
          <section className="account-info-row">
            <div className="account-info-label">
              Tôi muốn biết thông tin và ưu đãi liên quan đến chuyến đi sắp tới
              của mình.
            </div>
            <div className="account-info-value">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </section>
          <section className="account-info-row">
            <button className="delete-account-btn">
              Xóa bỏ tài khoản của tôi
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;
