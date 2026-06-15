import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaceholderImage from './PlaceholderImage';

function MemoryCard({ memory, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const images = memory.images || [memory.image];
  const hasMultiple = images.length > 1;

  const handleImageError = (idx) => {
    setImgErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const handleClick = () => {
    if (onClick) {
      onClick({ ...memory, image: images[currentIndex] });
    }
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      className="memory-card"
      whileHover={{ y: -4 }}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="memory-card-image">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          >
            {imgErrors[currentIndex] ? (
              <PlaceholderImage text={memory.title} />
            ) : (
              <img
                src={images[currentIndex]}
                alt={`${memory.title} - ${currentIndex + 1}`}
                loading="lazy"
                onError={() => handleImageError(currentIndex)}
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="memory-card-image-overlay" />

        {/* Slider Controls */}
        {hasMultiple && (
          <>
            <button
              className="memory-slider-btn memory-slider-prev"
              onClick={goPrev}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              className="memory-slider-btn memory-slider-next"
              onClick={goNext}
              aria-label="Next photo"
            >
              ›
            </button>
            <div className="memory-slider-dots">
              {images.length <= 7 ? (
                images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`memory-slider-dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                  />
                ))
              ) : (
                <span className="memory-slider-count">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <div className="memory-card-body">
        <span className="memory-card-mobile-date">{memory.date}</span>
        <h3 className="memory-card-title">{memory.title}</h3>
        <p className="memory-card-caption">{memory.caption}</p>
      </div>
    </motion.div>
  );
}

export default MemoryCard;
