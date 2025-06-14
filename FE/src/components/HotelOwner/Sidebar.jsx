import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import {assets} from '../../assets/assets'

const Sidebar = () => {
  const sidebarLinks = [
    { name: 'Dashboard', path: '', icon: '🏨' },
    { name: 'Add Room', path: 'add-room', icon: assets.addRoomIcon },
    { name: 'List Rooms', path: 'list-rooms', icon: assets.listRoomIcon },
  ]

  return (
    <div className="sidebar-container">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end='/owner'
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <span className="sidebar-icon">{item.icon}</span>
          <p className="sidebar-text">{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
