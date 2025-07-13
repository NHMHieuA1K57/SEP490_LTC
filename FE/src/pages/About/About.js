import "./About.scss"

const About = () => {
  const stats = [
    { number: "10M+", label: "Happy Travelers" },
    { number: "50K+", label: "Hotels Worldwide" },
    { number: "200+", label: "Countries" },
    { number: "24/7", label: "Customer Support" },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300&text=Sarah+Johnson",
      bio: "Former hospitality executive with 15+ years of experience in luxury travel.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300&text=Michael+Chen",
      bio: "Tech innovator passionate about creating seamless travel experiences.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300&text=Emily+Rodriguez",
      bio: "Operations expert ensuring quality and reliability across all partnerships.",
    },
    {
      name: "David Kim",
      role: "Head of Design",
      image: "/placeholder.svg?height=300&width=300&text=David+Kim",
      bio: "Design leader focused on creating intuitive and beautiful user experiences.",
    },
  ]

  const values = [
    {
      icon: "🎯",
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from booking to checkout.",
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships through transparency, reliability, and integrity.",
    },
    {
      icon: "🌍",
      title: "Global Reach",
      description: "Connecting travelers with amazing accommodations in every corner of the world.",
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology and features.",
    },
  ]

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About QuickStay</h1>
            <p>
              We're on a mission to make travel accessible, enjoyable, and memorable for everyone. Since 2015, we've
              been connecting millions of travelers with their perfect accommodations worldwide.
            </p>
          </div>
          <div className="hero-image">
            <img src="/placeholder.svg?height=500&width=700&text=About+QuickStay+Hero" alt="About QuickStay" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                QuickStay was born from a simple idea: travel should be effortless and inspiring. Our founders, avid
                travelers themselves, experienced firsthand the frustrations of booking accommodations - endless
                searching, hidden fees, and unreliable information.
              </p>
              <p>
                In 2015, we set out to change that. We built a platform that puts travelers first, partnering with
                trusted accommodations worldwide and leveraging technology to create seamless booking experiences.
              </p>
              <p>
                Today, we're proud to serve millions of travelers annually, helping them discover amazing places to stay
                and creating memories that last a lifetime.
              </p>
            </div>
            <div className="story-image">
              <img src="/placeholder.svg?height=400&width=500&text=Our+Story" alt="Our Story" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-item">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The passionate people behind QuickStay</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image || "/placeholder.svg"} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join millions of travelers who trust QuickStay for their accommodation needs.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Start Booking</button>
              <button className="btn btn-outline">Contact Us</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
