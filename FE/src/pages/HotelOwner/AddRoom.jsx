import React, { useState } from 'react'
import './AddRoom.css'
import Title from '../../components/Title'

const AddRoom = () => {
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free wifi': false,
      'Free breakfast': false,
      'Room service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })

  return (
    <form className="addroom-form">
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Add a new room to your hotel"
      />

      <p className="addroom-section-title">Images</p>
      <div className="addroom-image-grid">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className="addroom-image-preview"
              src={images[key] ? URL.createObjectURL(images[key]) : ''}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>

      <div className="addroom-inputs">
        <div className="addroom-input-group">
          <p className="addroom-section-title">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) =>
              setInputs({ ...inputs, roomType: e.target.value })
            }
            className="addroom-select"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div className="addroom-input-price">
          <p className="addroom-section-title">
            Price <span className="addroom-hint">/ night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="addroom-number"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>

      <p className="addroom-section-title">Amenities</p>
      <div className="addroom-amenities">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className="addroom-checkbox-wrapper">
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity]
                  }
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
          </div>
        ))}
      </div>

      <button className="addroom-submit">Add Room</button>
    </form>
  )
}

export default AddRoom
