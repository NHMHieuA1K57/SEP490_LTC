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

import Register from "./pages/Auth/RegisterPage";
import Layout from "./pages/HotelOwner/Layout";
import Dashboard from "./pages/HotelOwner/Dashboard";
import AddRoom from "./pages/HotelOwner/AddRoom";
import ListRoom from "./pages/HotelOwner/ListRoom";
import Hero from "./components/Hero/Hero";
import Account from "./pages/Account";

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
            <Route path="/account" element={<Account />} />

            <Route path="/about" element={<About />} />
            <Route path="/destination" element={<Destination />} />

            <Route path="/register" element={<Register />} />
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
