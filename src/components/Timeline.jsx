import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { memories } from '../data/memories';
import MemoryCard from './MemoryCard';

gsap.registerPlugin(ScrollTrigger);

function Timeline() {
  const [lightboxImage, setLightboxImage] = useState(null);
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  const openLightbox = (memory) => {
    setLightboxImage(memory);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const timelineItems = section.querySelectorAll('.timeline-item');

    const triggers = [];

    timelineItems.forEach((item) => {
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        onEnter: () => {
          item.classList.add('visible');
        },
      });
      triggers.push(trigger);
    });

    if (lineRef.current) {
      const lineTween = gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        }
      );
      triggers.push(lineTween.scrollTrigger);
    }

    return () => {
      triggers.forEach((trigger) => {
        if (trigger) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <>
      <section className="timeline-section" ref={sectionRef}>
        <h2 className="timeline-title">Perjalanan Kita</h2>
        <p className="timeline-subtitle">Setiap momen adalah cerita</p>

        <div className="timeline-container">
          <div className="timeline-line" ref={lineRef} />

          {memories.map((memory) => (
            <div className="timeline-item" key={memory.id}>
              <div className="timeline-dot" />
              <span className="timeline-date">{memory.date}</span>
              <MemoryCard memory={memory} onClick={openLightbox} />
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="lightbox-overlay"
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              className="lightbox-image"
              src={lightboxImage.image}
              alt={lightboxImage.title}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <motion.p
              className="lightbox-caption"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {lightboxImage.caption}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Timeline;
