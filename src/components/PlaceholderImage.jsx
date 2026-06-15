import React from 'react';

function PlaceholderImage({ text, className }) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className || ''}`}
      style={{
        background: 'linear-gradient(135deg, var(--color-deep-purple), var(--color-purple-mist))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        className="font-serif text-soft-violet"
        style={{
          fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
          textAlign: 'center',
          padding: '1rem',
          opacity: 0.7,
          letterSpacing: '0.05em',
          lineHeight: 1.6,
          userSelect: 'none',
        }}
      >
        {text || 'Kenangan...'}
      </span>
    </div>
  );
}

export default PlaceholderImage;
