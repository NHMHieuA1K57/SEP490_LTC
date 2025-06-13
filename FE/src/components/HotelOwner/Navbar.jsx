import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
        <Link to="/" className="navbar-logo">
            <span className="navbar-icon">🏨</span>
            <span className="navbar-text">QuickStay</span>
        </Link>
        
        <div className="navbar-auth-links">
          <Link to="/login" className="login-link">Login</Link>
          <Link to="/register" className="register-link">Register</Link>
        </div>
    </div>
  )
}

export default Navbar
