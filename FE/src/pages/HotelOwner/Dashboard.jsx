import React, { useState } from 'react'
import './Dashboard.css'
import Title from '../../components/Title'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([])

  return (
    <div className="dashboard-container">
      <Title align="left" font="outfit" title="Dashboard" subTitle="Welcome to your dashboard" />

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <img src="" alt="" className="dashboard-img" />
          <div className="dashboard-card-content">
            <p className="dashboard-label">Total Bookings</p>
            <p className="dashboard-value">{dashboardData}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <img src="" alt="" className="dashboard-img" />
          <div className="dashboard-card-content">
            <p className="dashboard-label">Total Revenue</p>
            <p className="dashboard-value">$ {dashboardData}</p>
          </div>
        </div>
      </div>

      <h2 className="dashboard-subtitle">Recent Bookings</h2>
      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th className="hide-sm">Room Name</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((item, index) => (
              <tr key={index}>
                <td>{item.user}</td>
                <td className="hide-sm">{item.room}</td>
                <td>$ {item.totalAmount}</td>
                <td>
                  <button className={`dashboard-status-btn ${item.isPaid ? 'paid' : 'pending'}`}>
                    {item.isPaid ? 'Complete' : 'Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
