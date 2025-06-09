import React, { useState, useEffect, useRef } from "react";
import "./Carousel.scss";

const Carousel = ({ children, itemsPerView = 1, gap = 20 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const containerRef = useRef(null);

  const totalItems = React.Children.count(children);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setItemsToShow(1);
      } else if (window.innerWidth <= 900) {
        setItemsToShow(Math.min(2, itemsPerView));
      } else if (window.innerWidth <= 1200) {
        setItemsToShow(Math.min(3, itemsPerView));
      } else {
        setItemsToShow(itemsPerView);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, totalItems - itemsToShow);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const showNavigation = totalItems > itemsToShow;

  // Tính toán chính xác width và transform
  const itemWidth = `calc((100% - ${
    gap * (itemsToShow - 1)
  }px) / ${itemsToShow})`;

  return (
    <div className="carousel" ref={containerRef}>
      <div className="carousel__wrapper">
        <div className="carousel__container">
          <div
            className="carousel__track"
            style={{
              transform: `translateX(calc(-${currentIndex} * (${itemWidth} + ${gap}px)))`,
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div
                key={index}
                className="carousel__item"
                style={{
                  width: itemWidth,
                  marginRight: index < totalItems - 1 ? `${gap}px` : "0",
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            {currentIndex > 0 && (
              <button
                className="carousel__nav carousel__nav--prev"
                onClick={goToPrev}
              >
                ‹
              </button>
            )}

            {currentIndex < maxIndex && (
              <button
                className="carousel__nav carousel__nav--next"
                onClick={goToNext}
              >
                ›
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Carousel;
