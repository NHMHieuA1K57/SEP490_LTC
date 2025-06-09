import React, { useState } from "react";
import "./Hero.scss";

const Hero = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", { destination, checkIn, checkOut });
  };

  return (
    <section className="hero">
      <div className="hero__background">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
          alt="Luxury resort with pool and palm trees"
          className="hero__image"
        />
        <div className="hero__overlay"></div>
      </div>

      <div className="container">
        <div className="hero__content">
          <div className="hero__badge">The Ultimate Hotel Experience</div>

          <h1 className="hero__title">
            Discover Your Perfect
            <br />
            Getaway Destination
          </h1>

          <p className="hero__subtitle">
            Unparalleled luxury and comfort await in the world's most exclusive
            <br />
            destinations. Start your journey with us today.
          </p>

          <form className="hero__search" onSubmit={handleSearch}>
            <div className="search-field">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Dubai"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Check In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Check Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
