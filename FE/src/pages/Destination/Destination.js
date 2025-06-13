"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Destination.scss"

const Destination = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Destinations" },
    { id: "beach", name: "Beach" },
    { id: "city", name: "City" },
    { id: "mountain", name: "Mountain" },
    { id: "cultural", name: "Cultural" },
  ]

  const destinations = [
    {
      id: 1,
      name: "Maldives",
      country: "Maldives",
      category: "beach",
      image: "/placeholder.svg?height=400&width=600&text=Maldives+Paradise",
      hotels: 120,
      startingPrice: 450,
      description: "Crystal clear waters and overwater bungalows in tropical paradise.",
      featured: true,
    },
    {
      id: 2,
      name: "Tokyo",
      country: "Japan",
      category: "city",
      image: "/placeholder.svg?height=400&width=600&text=Tokyo+Skyline",
      hotels: 850,
      startingPrice: 180,
      description: "Modern metropolis blending tradition with cutting-edge technology.",
      featured: true,
    },
    {
      id: 3,
      name: "Swiss Alps",
      country: "Switzerland",
      category: "mountain",
      image: "/placeholder.svg?height=400&width=600&text=Swiss+Alps",
      hotels: 200,
      startingPrice: 320,
      description: "Breathtaking mountain views and world-class skiing resorts.",
      featured: false,
    },
    {
      id: 4,
      name: "Santorini",
      country: "Greece",
      category: "cultural",
      image: "/placeholder.svg?height=400&width=600&text=Santorini+Greece",
      hotels: 180,
      startingPrice: 280,
      description: "Iconic white buildings and stunning Mediterranean sunsets.",
      featured: true,
    },
    {
      id: 5,
      name: "Bali",
      country: "Indonesia",
      category: "beach",
      image: "/placeholder.svg?height=400&width=600&text=Bali+Beach",
      hotels: 450,
      startingPrice: 120,
      description: "Tropical beaches, ancient temples, and vibrant culture.",
      featured: false,
    },
    {
      id: 6,
      name: "New York",
      country: "USA",
      category: "city",
      image: "/placeholder.svg?height=400&width=600&text=New+York+City",
      hotels: 1200,
      startingPrice: 200,
      description: "The city that never sleeps with endless entertainment and dining.",
      featured: false,
    },
    {
      id: 7,
      name: "Machu Picchu",
      country: "Peru",
      category: "cultural",
      image: "/placeholder.svg?height=400&width=600&text=Machu+Picchu",
      hotels: 80,
      startingPrice: 150,
      description: "Ancient Incan citadel high in the Andes Mountains.",
      featured: false,
    },
    {
      id: 8,
      name: "Aspen",
      country: "USA",
      category: "mountain",
      image: "/placeholder.svg?height=400&width=600&text=Aspen+Mountains",
      hotels: 95,
      startingPrice: 400,
      description: "Premier ski destination with luxury mountain resorts.",
      featured: false,
    },
  ]

  const filteredDestinations =
    activeCategory === "all" ? destinations : destinations.filter((dest) => dest.category === activeCategory)

  const featuredDestinations = destinations.filter((dest) => dest.featured)

  return (
    <div className="destination-page">
      {/* Hero Section */}
      <section className="destination-hero">
        <div className="hero-background">
          <img src="/placeholder.svg?height=600&width=1200&text=Explore+Destinations" alt="Destinations" />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1>Explore Amazing Destinations</h1>
            <p>Discover incredible places around the world and find your perfect getaway</p>
            <div className="search-bar">
              <input type="text" placeholder="Where do you want to go?" />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <div className="container">
          <div className="section-header">
            <h2>Featured Destinations</h2>
            <p>Our most popular and highly recommended travel destinations</p>
          </div>
          <div className="featured-grid">
            {featuredDestinations.map((destination) => (
              <Link key={destination.id} to={`/hotels?destination=${destination.name}`} className="featured-card">
                <div className="card-image">
                  <img src={destination.image || "/placeholder.svg"} alt={destination.name} />
                  <div className="card-overlay">
                    <div className="card-content">
                      <h3>{destination.name}</h3>
                      <p>{destination.country}</p>
                      <div className="card-stats">
                        <span>{destination.hotels} hotels</span>
                        <span>From ${destination.startingPrice}/night</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Destinations */}
      <section className="all-destinations">
        <div className="container">
          <div className="section-header">
            <h2>All Destinations</h2>
            <p>Browse our complete collection of travel destinations</p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Destinations Grid */}
          <div className="destinations-grid">
            {filteredDestinations.map((destination) => (
              <Link key={destination.id} to={`/hotels?destination=${destination.name}`} className="destination-card">
                <div className="card-image">
                  <img src={destination.image || "/placeholder.svg"} alt={destination.name} />
                  {destination.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{destination.name}</h3>
                    <span className="country">{destination.country}</span>
                  </div>
                  <p className="description">{destination.description}</p>
                  <div className="card-footer">
                    <div className="stats">
                      <span className="hotels">{destination.hotels} hotels</span>
                      <span className="price">From ${destination.startingPrice}/night</span>
                    </div>
                    <button className="btn btn-outline">Explore</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="destination-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Can't Find Your Dream Destination?</h2>
            <p>Contact our travel experts and let us help you plan the perfect trip</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Contact Us</button>
              <button className="btn btn-outline">View All Hotels</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Destination
