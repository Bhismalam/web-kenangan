import { useState, useEffect, useRef, useMemo } from 'react';
import { config } from '../data/memories';

const ClosingNote = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const sectionRef = useRef(null);

  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, []);

  const confettiPieces = useMemo(() => {
    const colors = ['#c4737e', '#d4a574', '#d4a0a7', '#6b4c8a'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 1.5,
    }));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const message = config.closingMessage;
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayedText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingDone(true);

        setTimeout(() => {
          setShowSignature(true);
        }, 500);

        setTimeout(() => {
          setShowReplay(true);
          setShowConfetti(true);
        }, 1000);
      }
    }, 30);

    return () => {
      clearInterval(typingInterval);
    };
  }, [hasStarted]);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <section className="closing-section" ref={sectionRef}>
      <div className="closing-stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="closing-content">
        <div className={`closing-icon ${hasStarted ? 'visible' : ''}`}>
          ❤️
        </div>

        <p className="closing-message">
          {displayedText}
          {!isTypingDone && <span className="typewriter-cursor" />}
        </p>

        <p className={`closing-signature ${showSignature ? 'visible' : ''}`}>
          {config.closingSignature}
        </p>

        <button
          className={`replay-btn ${showReplay ? 'visible' : ''}`}
          onClick={handleReplay}
        >
          Putar Ulang Dari Awal
        </button>
      </div>

      {isTypingDone && showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                '--duration': `${piece.duration}s`,
                '--delay': `${piece.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ClosingNote;
