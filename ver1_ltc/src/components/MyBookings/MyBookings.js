import BookingCard from "../../components/BookingCard/BookingCard";
import "./MyBookings.scss";

const MyBookings = () => {
  const bookings = [
    {
      id: 1,
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

        <div className="bookings-table-header">
          <div className="column-header">Hotels</div>
          <div className="column-header">Date & Timings</div>
          <div className="column-header">Payment</div>
        </div>

        <div className="bookings-list">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
