import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const isDesktop = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    isDesktop.current = mediaQuery.matches;

    const handleMediaChange = (e) => {
      isDesktop.current = e.matches;
      if (dotRef.current) {
        dotRef.current.style.display = e.matches ? 'block' : 'none';
      }
      if (ringRef.current) {
        ringRef.current.style.display = e.matches ? 'block' : 'none';
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    if (!isDesktop.current) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }

      const target = e.target;
      const isInteractive = target.closest('a, button, .memory-card, .envelope-wrapper, video');
      if (ringRef.current) {
        if (isInteractive) {
          ringRef.current.classList.add('hovering');
        } else {
          ringRef.current.classList.remove('hovering');
        }
      }
    };

    const animateRing = () => {
      const lerp = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      animationFrameId.current = requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleMediaChange);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
};

export default CustomCursor;
