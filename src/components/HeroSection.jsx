import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { config } from '../data/memories';

const HeroSection = ({ onEnvelopeOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAfterOpen, setShowAfterOpen] = useState(false);
  const greetingRef = useRef(null);
  const subtextRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    if (greetingRef.current) {
      gsap.to(greetingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.5,
      });
    }
  }, []);

  const handleEnvelopeClick = () => {
    if (isOpen) return;

    setIsOpen(true);

    setTimeout(() => {
      setShowAfterOpen(true);

      if (subtextRef.current) {
        gsap.fromTo(
          subtextRef.current,
          { opacity: 0, y: 15 },
          { opacity: 0.7, y: 0, duration: 0.8, ease: 'power2.out' }
        );
      }

      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
        );
      }

      if (onEnvelopeOpen) {
        onEnvelopeOpen();
      }
    }, 1500);
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1
          className="hero-greeting"
          ref={greetingRef}
        >
          {config.heroGreeting}
        </h1>

        <div
          className="envelope-wrapper"
          onClick={handleEnvelopeClick}
          style={{ animation: 'float 4s ease-in-out infinite' }}
        >
          <div className="envelope">
            <div className="envelope-body" />
            <div className="envelope-inner" />
            <div className={`envelope-flap${isOpen ? ' open' : ''}`} />
            <div className={`envelope-letter${isOpen ? ' revealed' : ''}`}>
              <p className="envelope-letter-text">{config.heroSubtext}</p>
            </div>
          </div>
        </div>

        {showAfterOpen && (
          <p className="hero-subtext" ref={subtextRef}>
            Sebuah perjalanan yang tak akan terlupakan
          </p>
        )}
      </div>

      {showAfterOpen && (
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <span>Scroll ke bawah</span>
          <div className="scroll-arrow" />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
