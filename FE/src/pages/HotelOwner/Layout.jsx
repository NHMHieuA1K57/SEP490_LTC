import React from 'react'
import './Layout.css'
import Navbar from '../../components/HotelOwner/Navbar'
import Sidebar from '../../components/HotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='layout-container'>
        <Navbar />
        <div className='layout-content'>
            <Sidebar />
            <div className='layout-outlet'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default Layout
