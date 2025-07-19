import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.scss";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <span className="breadcrumb-separator"> &gt; </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
