import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import HotelDetail from "./pages/HotelDetail/HotelDetail";
import MyBookings from "./pages/MyBookings/MyBookings";
import HotelRooms from "./pages/HotelRooms/HotelRooms";
import Login from "./pages/Auth/LoginPage";
import Payment from "./pages/Payment/Payment";
import About from "./pages/About/About";
import Destination from "./pages/Destination/Destination";
import "./App.scss";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotels" element={<HotelRooms />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/about" element={<About />} />
            <Route path="/destination" element={<Destination />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
