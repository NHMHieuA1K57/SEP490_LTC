"use client";

import { useState } from "react";
import "./HotelRooms.scss";

const HotelRooms = () => {
  const [filters, setFilters] = useState({
    popularFilters: [],
    priceRange: [],
    sortBy: "bestLowToHigh",
  });

  const hotels = [
    {
      id: 1,
      name: "The Grand Resort",
      location: "Los Angeles, California, USA",
      price: 100,
      rating: 5,
      reviews: "200+ reviews",
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Free wifi", "Free breakfast", "Guest service"],
    },
    {
      id: 2,
      name: "The Regal Palace",
      location: "Skyline Residence Rd, USA",
      price: 150,
      rating: 5,
      reviews: "200+ reviews",
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Free wifi", "Free breakfast", "Guest service"],
    },
    {
      id: 3,
      name: "Velvet Nights Inn",
      location: "Beachfront Drive, CA, USA",
      price: 120,
      rating: 5,
      reviews: "200+ reviews",
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Free wifi", "Free breakfast", "Guest service"],
    },
    {
      id: 4,
      name: "Crystal Waters Resort",
      location: "Near Sky Passage Rd, USA",
      price: 200,
      rating: 5,
      reviews: "200+ reviews",
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Free wifi", "Free breakfast", "Guest service"],
    },
    {
      id: 5,
      name: "Skyline Luxe Hotel",
      location: "Niles Avenue, Chicago, USA",
      price: 250,
      rating: 5,
      reviews: "200+ reviews",
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Free wifi", "Free breakfast", "Guest service"],
    },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  return (
    <div className="hotel-rooms">
      <div className="container">
        <div className="page-header">
          <h1>Hotel Rooms</h1>
          <p>
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        <div className="content-layout">
          <div className="hotels-list">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                  />
                </div>
                <div className="hotel-details">
                  <div className="hotel-header">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <div className="hotel-rating">
                      <div className="stars">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      <span className="reviews">{hotel.reviews}</span>
                    </div>
                  </div>
                  <p className="hotel-location">📍 {hotel.location}</p>
                  <div className="hotel-amenities">
                    {hotel.amenities.map((amenity, index) => (
                      <span key={index} className="amenity">
                        {amenity === "Free wifi" && "📶"}
                        {amenity === "Free breakfast" && "🍳"}
                        {amenity === "Guest service" && "👤"}
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="hotel-footer">
                    <div className="price">
                      <span className="amount">${hotel.price}</span>
                      <span className="period">/day</span>
                    </div>
                    <a href={`/hotel/${hotel.id}`} className="btn btn-outline">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
            <div className="show-more">
              <button className="btn btn-primary">Show More</button>
            </div>
          </div>

          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>FILTERS</h3>
              <button className="clear-btn">CLEAR</button>
            </div>

            <div className="filter-section">
              <h4>Popular filters</h4>
              <div className="filter-options">
                {[
                  "Single Bed",
                  "Family Suite",
                  "Deluxe Room",
                  "Luxury Resort",
                ].map((filter) => (
                  <label key={filter} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.popularFilters.includes(filter)}
                      onChange={() =>
                        handleFilterChange("popularFilters", filter)
                      }
                    />
                    <span className="checkmark"></span>
                    {filter}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Price</h4>
              <div className="filter-options">
                {["$250 to $500", "$500 to $1000", "$1000 to $1500"].map(
                  (range) => (
                    <label key={range} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.priceRange.includes(range)}
                        onChange={() => handleFilterChange("priceRange", range)}
                      />
                      <span className="checkmark"></span>
                      {range}
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="filter-section">
              <h4>Sort by</h4>
              <div className="filter-options">
                {[
                  { value: "bestLowToHigh", label: "Best Low to High" },
                  { value: "priceHighToLow", label: "Price High to Low" },
                  { value: "newestFirst", label: "Newest First" },
                ].map((option) => (
                  <label key={option.value} className="filter-option">
                    <input
                      type="radio"
                      name="sortBy"
                      checked={filters.sortBy === option.value}
                      onChange={() => handleSortChange(option.value)}
                    />
                    <span className="radiomark"></span>
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRooms;
