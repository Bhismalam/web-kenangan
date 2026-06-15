import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { AnimatePresence, motion } from 'framer-motion';
import { config } from '../data/memories';

const AudioController = ({ isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef(null);

  // Create Howl instance on mount
  useEffect(() => {
    howlRef.current = new Howl({
      src: [config.backgroundMusic],
      loop: true,
      volume: 0.4,
      html5: false,
      preload: true,
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, []);

  // When isActive becomes true, auto-play with fade in
  useEffect(() => {
    if (isActive && howlRef.current && !isPlaying) {
      howlRef.current.volume(0);
      howlRef.current.play();
      howlRef.current.fade(0, 0.4, 2000);
      setIsPlaying(true);
    }
  }, [isActive]);

  // Toggle play/pause
  const handleToggle = useCallback(() => {
    if (!howlRef.current) return;

    if (isPlaying) {
      howlRef.current.pause();
      setIsPlaying(false);
    } else {
      howlRef.current.play();
      howlRef.current.fade(howlRef.current.volume(), 0.4, 500);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="audio-controller"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            pointerEvents: isActive ? 'auto' : 'none',
          }}
        >
          <button className="audio-btn" onClick={handleToggle} aria-label={isPlaying ? 'Pause music' : 'Play music'}>
            {isPlaying ? (
              <div className="audio-bars playing">
                <span className="audio-bar" />
                <span className="audio-bar" />
                <span className="audio-bar" />
                <span className="audio-bar" />
              </div>
            ) : (
              <svg
                className="audio-mute-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioController;
