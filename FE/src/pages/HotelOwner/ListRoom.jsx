import React, { useState } from 'react'
import Title from '../../components/Title'
import './ListRoom.css'
import { roomsDummyData } from '../../assets/assets'

const ListRoom = () => {
  const [rooms, setRooms] = useState(roomsDummyData)

  return (
    <div className="listroom-container">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="List of rooms"
      />
      <p className="listroom-section-title">All Room</p>
      <div className="listroom-table-wrapper">
        <table className="listroom-table">
          <thead className="listroom-table-head">
            <tr>
              <th>Name</th>
              <th>Facility</th>
              <th>Price / night</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="listroom-td">{item.roomType}</td>
                <td className="listroom-td listroom-td-facility">
                  {item.amenities.join(', ')}
                </td>
                <td className="listroom-td">{item.pricePerNight}</td>
                <td className="listroom-td listroom-td-action">
                  <label className="listroom-toggle-wrapper">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      readOnly
                    />
                    <div className="listroom-toggle-track"></div>
                    <span className="listroom-toggle-dot"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListRoom
