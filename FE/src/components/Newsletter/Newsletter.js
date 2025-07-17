import React, { useState } from "react";
import "./Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng ký nhận tin:", email);
    setEmail("");
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter__content">
          <h2 className="newsletter__title">Đăng ký nhận bản tin</h2>
          <p className="newsletter__subtitle">
            Nhận thông tin ưu đãi mới nhất, điểm đến hấp dẫn và cảm hứng du lịch
            mỗi tuần từ chúng tôi.
          </p>

          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter__input"
              required
            />
            <button type="submit" className="newsletter__button">
              Đăng ký nhận tin &rarr;
            </button>
          </form>

          <p className="newsletter__privacy">
            Khi đăng ký, bạn đồng ý với Chính sách bảo mật và nhận thông báo từ
            chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
