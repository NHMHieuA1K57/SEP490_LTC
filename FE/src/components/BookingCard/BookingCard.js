import "./BookingCard.scss";

const BookingCard = ({ booking }) => {
  const { name, type, location, image, checkIn, checkOut, total, status } =
    booking;

  return (
    <div className="booking-card card">
      <div className="hotel-info">
        <div className="hotel-image">
          <img src={image || "/placeholder.svg"} alt={name} />
        </div>
        <div className="hotel-details">
          <h3 className="hotel-name">
            {name} <span className="hotel-type">({type})</span>
          </h3>
          <p className="hotel-location">{location}</p>
          <p className="hotel-price">Total: ${total}</p>
        </div>
      </div>

      <div className="date-info">
        <div className="date-section">
          <label>Check-In:</label>
          <span>{checkIn}</span>
        </div>
        <div className="date-section">
          <label>Check-Out:</label>
          <span>{checkOut}</span>
        </div>
      </div>

      <div className="payment-info">
        <span className={`status-badge ${status}`}>
          {status === "paid" ? "Paid" : "Unpaid"}
        </span>
        {status === "unpaid" && (
          <button className="btn btn-outline pay-now-btn">Pay now</button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
