import React from "react";
import "./Testimonials.scss";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Minh",
      rating: 5,
      text: '"Dịch vụ tuyệt vời, nhân viên thân thiện và hỗ trợ nhiệt tình. Tôi sẽ quay lại lần nữa!"',
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      name: "Trần Văn Nam",
      rating: 5,
      text: '"Khách sạn sạch sẽ, tiện nghi, đặt phòng nhanh chóng và dễ dàng."',
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      name: "Lê Thị Hồng",
      rating: 5,
      text: '"Tôi rất hài lòng với trải nghiệm đặt phòng tại đây. Sẽ giới thiệu cho bạn bè!"',
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>
          <p className="section-subtitle">
            Khám phá lý do vì sao hàng ngàn khách hàng tin tưởng và lựa chọn
            dịch vụ đặt phòng của chúng tôi.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-card__rating">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <span key={index} className="star">
                    ★
                  </span>
                ))}
              </div>

              <p className="testimonial-card__text">{testimonial.text}</p>

              <div className="testimonial-card__author">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="author-avatar"
                />
                <span className="author-name">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
