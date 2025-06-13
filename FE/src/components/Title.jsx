import React from 'react'
import './Title.css'

const Title = ({ title, subTitle, align, font }) => {
  return (
    <div
      className={`title-container ${
        align === 'left' ? 'title-align-left' : ''
      }`}
    >
      <h1 className={`title-heading ${font || 'font-playfair'}`}>{title}</h1>
      <p className="title-subtitle">{subTitle}</p>
    </div>
  )
}

export default Title
