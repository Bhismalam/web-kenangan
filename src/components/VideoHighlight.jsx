import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { videoHighlights } from '../data/memories';

gsap.registerPlugin(ScrollTrigger);

const VideoHighlight = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const wrapperRef = useRef(null);

  const hasVideos = videoHighlights && videoHighlights.length > 0;
  const currentVideo = hasVideos ? videoHighlights[currentIndex] : null;

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (wrapperRef.current) {
        gsap.fromTo(
          wrapperRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle overlay click: play and unmute
  const handleOverlayClick = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    video.muted = false;
    video.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  // Handle video click: toggle play/pause
  const handleVideoClick = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Update progress
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  }, []);

  // Switch video
  const switchVideo = useCallback((newIndex) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCurrentIndex(newIndex);
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const goNextVideo = (e) => {
    e.stopPropagation();
    switchVideo((currentIndex + 1) % videoHighlights.length);
  };

  const goPrevVideo = (e) => {
    e.stopPropagation();
    switchVideo((currentIndex - 1 + videoHighlights.length) % videoHighlights.length);
  };

  return (
    <section className="video-section" ref={sectionRef}>
      <div ref={titleRef} style={{ opacity: 0 }}>
        <h2 className="video-section-title">Momen Dalam Gerakan</h2>
        <p className="video-section-subtitle">
          {hasVideos ? `${videoHighlights.length} video kenangan` : 'Kenangan yang hidup'}
        </p>
      </div>

      <div className="video-player-wrapper" ref={wrapperRef} style={{ opacity: 0 }}>
        {hasVideos && currentVideo ? (
          <>
            <video
              ref={videoRef}
              key={currentVideo.src}
              muted
              playsInline
              poster={currentVideo.poster}
              onTimeUpdate={handleTimeUpdate}
              onClick={handleVideoClick}
              src={currentVideo.src}
            />

            <div
              className={`video-overlay${isPlaying ? ' hidden' : ''}`}
              onClick={handleOverlayClick}
            >
              <div className="video-play-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>

            <div
              className="video-progress-bar"
              style={{ width: `${progress}%` }}
            />

            <div className="video-vignette" />

            {/* Video Navigation */}
            {videoHighlights.length > 1 && (
              <>
                <button className="video-nav-btn video-nav-prev" onClick={goPrevVideo} aria-label="Previous video">
                  ‹
                </button>
                <button className="video-nav-btn video-nav-next" onClick={goNextVideo} aria-label="Next video">
                  ›
                </button>
                <div className="video-counter">
                  {currentIndex + 1} / {videoHighlights.length}
                </div>
                <div className="video-title-badge">{currentVideo.title}</div>
              </>
            )}
          </>
        ) : (
          <div className="video-placeholder">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
            <p>Video akan ditambahkan</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoHighlight;
