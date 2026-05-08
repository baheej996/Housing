'use client';
import { useState } from 'react';

// Resolves various image URL types (Drive, Direct Links, Local Paths)
function resolveImageUrl(url) {
  if (!url) return 'https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found';
  
  const trimmed = url.trim();

  // 1. Handle Local Paths (if user just puts "photo.jpg")
  if (!trimmed.startsWith('http') && (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.webp') || trimmed.endsWith('.jpeg'))) {
    return `/images/${trimmed}`;
  }

  // 2. Handle Google Drive Share Links
  if (trimmed.includes('drive.google.com')) {
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  // 3. Direct Links (Imgur, Postimages, etc.) - return as is
  return trimmed;
}

export default function PhotoGallery({ photos }) {
  const [lightbox, setLightbox] = useState(null);

  if (!photos || photos.length === 0) return null;

  // Duplicate for seamless infinite scroll
  const doubled = [...photos, ...photos];

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}>
          <img
            src={resolveImageUrl(lightbox.Image_URL)}
            alt={lightbox.Caption || ''}
            onError={(e) => { e.target.src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Load+Error'; }}
            style={{
              maxWidth: '90vw', maxHeight: '75vh',
              borderRadius: '20px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              objectFit: 'contain'
            }}
            onClick={e => e.stopPropagation()}
          />
          {lightbox.Caption && (
            <p style={{ marginTop: '1.2rem', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textAlign: 'center' }}>
              {lightbox.Caption}
            </p>
          )}
          <button onClick={() => setLightbox(null)} style={{
            marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', padding: '0.5rem 1.5rem',
            borderRadius: '50px', cursor: 'pointer', fontSize: '0.9rem'
          }}>Close</button>
        </div>
      )}

      {/* Sliding Gallery Strip */}
      <div style={{ overflow: 'hidden', marginBottom: '3rem', position: 'relative' }}>
        {/* Left fade */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
          background: 'linear-gradient(90deg, var(--bg-dark), transparent)',
          pointerEvents: 'none'
        }} />
        {/* Right fade */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
          background: 'linear-gradient(270deg, var(--bg-dark), transparent)',
          pointerEvents: 'none'
        }} />

        <div className="photo-marquee">
          {doubled.map((photo, i) => (
            <div
              key={i}
              onClick={() => setLightbox(photo)}
              style={{
                flexShrink: 0,
                width: '220px',
                height: '160px',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <img
                src={resolveImageUrl(photo.Image_URL)}
                alt={photo.Caption || `Photo ${i + 1}`}
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/1a1a1a/ffffff?text=Link+Broken'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {photo.Caption && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '0.8rem 0.6rem 0.5rem',
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)',
                  fontWeight: '500'
                }}>
                  {photo.Caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
