'use client';
import { useState, useRef } from 'react';

// Resolves various image URL types (Drive, Direct Links, Local Paths)
function resolveImageUrl(url) {
  if (!url) return 'https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found';
  
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // 1. Handle Local Paths (e.g., "IMG_123.PNG" or "winner.jpg")
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const isLocal = !trimmed.startsWith('http') && extensions.some(ext => lower.endsWith(ext));
  
  if (isLocal) {
    // Ensure it starts with /images/ and use the ORIGINAL case for the filename
    return trimmed.startsWith('/images/') ? trimmed : `/images/${trimmed}`;
  }

  // 2. Handle Google Drive Share Links
  if (trimmed.includes('drive.google.com')) {
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  // 3. Direct Links (Imgur, Postimages, etc.)
  return trimmed;
}

export default function PhotoGallery({ photos }) {
  const [lightbox, setLightbox] = useState(null);
  const scrollRef = useRef(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      {/* Lightbox Overlay */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(15px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.3s ease'
          }}>
          <img
            src={resolveImageUrl(lightbox.Image_URL)}
            alt={lightbox.Caption || ''}
            onError={(e) => { e.target.src = 'https://placehold.co/800x600/1a1a1a/ffffff?text=Image+Load+Error'; }}
            style={{
              maxWidth: '95vw', maxHeight: '80vh',
              borderRadius: '24px',
              boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
              objectFit: 'contain'
            }}
            onClick={e => e.stopPropagation()}
          />
          {lightbox.Caption && (
            <p style={{ marginTop: '1.5rem', color: 'white', fontSize: '1.1rem', fontWeight: '500', textAlign: 'center' }}>
              {lightbox.Caption}
            </p>
          )}
          <button onClick={() => setLightbox(null)} style={{
            marginTop: '2rem', background: 'white', color: 'black',
            border: 'none', padding: '0.8rem 2rem',
            borderRadius: '50px', cursor: 'pointer', fontWeight: '600'
          }}>Close Gallery</button>
        </div>
      )}

      {/* Manual Scrollable Gallery */}
      <div style={{ marginBottom: '4rem', position: 'relative' }}>
        <div 
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.2rem',
            overflowX: 'auto',
            padding: '0.5rem 5% 1.5rem 5%',
            scrollSnapType: 'x proximity',
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
            cursor: 'grab'
          }}
          className="hide-scrollbar"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              onClick={() => setLightbox(photo)}
              style={{
                flexShrink: 0,
                width: '280px',
                height: '200px',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                scrollSnapAlign: 'start',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                background: 'rgba(255,255,255,0.02)'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={resolveImageUrl(photo.Image_URL)}
                alt={photo.Caption || `Photo ${i + 1}`}
                onError={(e) => { e.target.src = 'https://placehold.co/400x300/1a1a1a/ffffff?text=Link+Broken'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
              />
              {photo.Caption && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '1.5rem 1rem 0.8rem',
                  fontSize: '0.85rem', color: 'white',
                  fontWeight: '500'
                }}>
                  {photo.Caption}
                </div>
              )}
            </div>
          ))}
          {/* Spacer for end-padding */}
          <div style={{ width: '5%', flexShrink: 0 }}></div>
        </div>

        {/* Scroll Hint (Desktop only) */}
        <div style={{
          textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)',
          marginTop: '-0.5rem', opacity: 0.6
        }}>
          ← Swipe to browse photos →
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
