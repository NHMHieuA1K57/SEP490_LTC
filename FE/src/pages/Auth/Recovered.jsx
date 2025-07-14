import React from 'react';
import './Recovered.css';

export default function Recovered() {
  return (
    <section className="recovered-section">
      <div className="recovered-container">
        <div className="recovered-image">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Success Illustration"
          />
        </div>
        <div className="recovered-content">
          <h1 className="recovered-title">Password successfully set</h1>
          <h2 className="recovered-subtitle">Welcome HOME</h2>
        </div>
      </div>
    </section>
  );
}
