import React, { useState } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import FeaturedHotels from "./components/FeaturedHotels/FeaturedHotels";
import ExclusiveOffers from "./components/ExclusiveOffers/ExclusiveOffers";
import Testimonials from "./components/Testimonials/Testimonials";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/Footer/Footer";
import HotelDetail from "./components/HotelDetail/HotelDetail";
import "./App.scss";
import MyBookings from "./components/MyBookings/MyBookings";
import HotelRooms from "./components/HotelRooms/HotelRooms";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home' or 'hotel-detail'

  const showHotelDetail = () => {
    setCurrentPage("hotel-detail");
  };

  const showMyBooking = () => {
    setCurrentPage("booking-detail");
  };

  const showMyRoom = () => {
    setCurrentPage("room-detail");
  };

  const showHome = () => {
    setCurrentPage("home");
  };

  if (currentPage === "hotel-detail") {
    return (
      <div className="App">
        <Header onLogoClick={showHome} />
        <HotelDetail />
        <Footer />
      </div>
    );
  }

  if (currentPage === "booking-detail") {
    return (
      <div className="App">
        <Header onLogoClick={showHome} />
        <MyBookings />
        <Footer />
      </div>
    );
  }

  if (currentPage === "room-detail") {
    return (
      <div className="App">
        <Header onLogoClick={showHome} />
        <HotelRooms />
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header onViewBookings={showMyBooking} onViewRooms={showMyRoom} />
      <Hero />
      <FeaturedHotels onViewDetails={showHotelDetail} />
      <ExclusiveOffers />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;
