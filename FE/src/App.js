import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Homepage from "./pages/HomePage/HomePage";
import HotelDetail from "./pages/HotelDetail/HotelDetail";
import MyBookings from "./pages/MyBookings/MyBookings";
import HotelRooms from "./pages/HotelRooms/HotelRooms";
import LoginPage from "./pages/Auth/LoginPage";
import Payment from "./pages/Payment/Payment";
import "./App.scss";
import HotelReg from "./components/Admin/HotelReg";
import Layout from "./pages/HotelOwner/Layout";
import Dashboard from "./pages/HotelOwner/Dashboard";
import AddRoom from "./pages/HotelOwner/AddRoom";
import ListRoom from "./pages/HotelOwner/ListRoom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/hotels" element={<HotelRooms />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/register" element={<HotelReg />} />
            <Route path="/owner" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="add-room" element={<AddRoom />} />
              <Route path="list-rooms" element={<ListRoom />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
