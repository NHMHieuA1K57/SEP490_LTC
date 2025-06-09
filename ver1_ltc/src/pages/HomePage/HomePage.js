import HeroSection from "../../components/Hero/Hero";
import FeaturedHotels from "../../components/FeaturedHotels/FeaturedHotels";
import ExclusiveOffers from "../../components/ExclusiveOffers/ExclusiveOffers";
import Testimonials from "../../components/Testimonials/Testimonials";
import Newsletter from "../../components/Newsletter/Newsletter";
import "./HomePage.scss";

const Homepage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <FeaturedHotels />
      <ExclusiveOffers />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Homepage;
