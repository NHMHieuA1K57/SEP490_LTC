import React, { useState } from "react";
import "./Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter__content">
          <h2 className="newsletter__title">Stay Inspired</h2>
          <p className="newsletter__subtitle">
            Join our newsletter and be the first to discover new destinations,
            exclusive offers, and travel inspirations.
          </p>

          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter__input"
              required
            />
            <button type="submit" className="newsletter__button">
              Subscribe →
            </button>
          </form>

          <p className="newsletter__privacy">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
