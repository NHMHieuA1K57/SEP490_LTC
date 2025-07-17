import React from "react";
import Hero from "../../components/Hero/Hero";
import FavoriteDestinations from "../../components/FavoriteDestinations/FavoriteDestinations";

import FeaturedHotels from "../../components/FeaturedHotels/FeaturedHotels";
import ExclusiveOffers from "../../components/ExclusiveOffers/ExclusiveOffers";
import Testimonials from "../../components/Testimonials/Testimonials";
import Newsletter from "../../components/Newsletter/Newsletter";
import "./HomePage.scss";

function HomePage() {
  return (
    <>
      <Hero />
      <FavoriteDestinations />
      <FeaturedHotels />
      <ExclusiveOffers />
      <Testimonials />
      <Newsletter />
    </>
  );
}

export default HomePage;
