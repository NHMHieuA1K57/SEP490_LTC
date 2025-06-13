import React from "react";
import "./HotelReg.css";

const HotelReg = () => {
    return (
        <div className="modal-overlay">
            <form className="hotel-form">
                <img src="" alt="reg-image" className="reg-image" />

                <div className="form-content">
                    <img src="" alt="close-icon" className="close-icon" />
                    <p className="form-title">Register Your Hotel</p>

                    <div className="form-group">
                        <label htmlFor="name">Hotel Name</label>
                        <input id="name" type="text" placeholder="Type here" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact">Phone</label>
                        <input id="contact" type="text" placeholder="Type here" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input id="address" type="text" placeholder="Type here" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <select name="city" required>
                            <option value="">Select city</option>
                            {/* Add options here */}
                        </select>
                    </div>

                    <button className="submit-btn">Register</button>
                </div>
            </form>
        </div>
    );
};

export default HotelReg;
