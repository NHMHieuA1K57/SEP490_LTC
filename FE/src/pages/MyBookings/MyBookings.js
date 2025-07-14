import { Link } from "react-router-dom";
import "./MyBookings.scss";

const MyBookings = () => {
  const bookings = [
    {
      id: 1,
      hotelId: 1,
      name: "Crystal Waters Resort",
      type: "Single Bed",
      location: "West Hollywood, CA, USA",
      image: "/placeholder.svg?height=120&width=160",
      checkIn: "September 23, 2025",
      checkOut: "September 24, 2025",
      total: 200,
      status: "paid",
    },
    {
      id: 2,
      hotelId: 2,
      name: "The Grand Resort",
      type: "Single Bed",
      location: "Los Angeles, California, USA",
      image: "/placeholder.svg?height=120&width=160",
      checkIn: "September 20, 2025",
      checkOut: "September 22, 2025",
      total: 299,
      status: "unpaid",
    },
    {
      id: 3,
      hotelId: 3,
      name: "The Grand Resort",
      type: "Single Bed",
      location: "Los Angeles, California, USA",
      image: "/placeholder.svg?height=120&width=160",
      checkIn: "September 24, 2025",
      checkOut: "September 26, 2025",
      total: 299,
      status: "paid",
    },
  ];

  return (
    <div className="my-bookings">
      <div className="container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>
            Easily manage your past, current, and upcoming hotel reservations in
            one place. Plan your trips seamlessly with just a few clicks.
          </p>
        </div>

        <div className="bookings-filters">
          <div className="filter-tabs">
            <button className="filter-tab active">All Bookings</button>
            <button className="filter-tab">Upcoming</button>
            <button className="filter-tab">Completed</button>
            <button className="filter-tab">Cancelled</button>
          </div>
          <div className="filter-search">
            <input type="text" placeholder="Search bookings..." />
            <button className="search-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="bookings-table-header">
          <div className="column-header">Hotels</div>
          <div className="column-header">Date & Timings</div>
          <div className="column-header">Payment</div>
        </div>

        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="hotel-info">
                <div className="hotel-image">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.name}
                  />
                </div>
                <div className="hotel-details">
                  <Link to={`/hotel/${booking.hotelId}`} className="hotel-name">
                    {booking.name}{" "}
                    <span className="hotel-type">({booking.type})</span>
                  </Link>
                  <p className="hotel-location">{booking.location}</p>
                  <p className="hotel-price">Total: ${booking.total}</p>
                </div>
              </div>

              <div className="date-info">
                <div className="date-section">
                  <label>Check-In:</label>
                  <span>{booking.checkIn}</span>
                </div>
                <div className="date-section">
                  <label>Check-Out:</label>
                  <span>{booking.checkOut}</span>
                </div>
              </div>

              <div className="payment-info">
                <div className="status-section">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status === "paid" ? "✓ Paid" : "⚠ Unpaid"}
                  </span>
                  <span className="booking-id">#{booking.id}001</span>
                </div>

                <div className="action-buttons">
                  {booking.status === "unpaid" && (
                    <button className="btn btn-primary pay-now-btn">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      Pay Now
                    </button>
                  )}

                  <Link
                    to={`/hotel/${booking.hotelId}`}
                    className="btn btn-outline details-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Hotel
                  </Link>

                  <div className="more-actions">
                    <button className="btn btn-ghost more-btn">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                    <div className="dropdown-menu">
                      <button className="dropdown-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                        Download Receipt
                      </button>
                      <button className="dropdown-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16,6 12,2 8,6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        Share Booking
                      </button>
                      <button className="dropdown-item cancel">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;