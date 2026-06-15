import { useState, useEffect, lazy, Suspense } from 'react';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import HeroSection from './components/HeroSection';
import AudioController from './components/AudioController';
import Timeline from './components/Timeline';
import VideoHighlight from './components/VideoHighlight';
import ClosingNote from './components/ClosingNote';

function App() {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth entrance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpened(true);
  };

  return (
    <>
      {/* Loading Screen */}
      <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
        <div className="loading-spinner" />
        <p className="loading-text">Memuat kenangan...</p>
      </div>

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Ambient Particles */}
      <ParticleBackground />

      {/* Audio Controller - appears after envelope is opened */}
      <AudioController isActive={isEnvelopeOpened} />

      {/* Main Content */}
      <main>
        {/* Hero / Landing */}
        <HeroSection onEnvelopeOpen={handleEnvelopeOpen} />

        {/* Timeline Gallery */}
        <Timeline />

        {/* Video Highlight */}
        <VideoHighlight />

        {/* Closing Note */}
        <ClosingNote />
      </main>
    </>
  );
}

export default App;
