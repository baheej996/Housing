'use client';
import { useState, useRef, useEffect } from 'react';

// Resolves various image URL types (Drive, Direct Links, Local Paths)
function isVideoUrl(url) {
  if (!url) return false;
  const lower = url.trim().toLowerCase();
  return ['.mp4', '.webm', '.ogg', '.mov'].some(ext => lower.includes(ext));
}

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

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

function renderMedia(photo, isLightbox = false) {
  const url = photo.Image_URL;
  if (!url) {
    return <img src="https://placehold.co/600x400/1a1a1a/ffffff?text=No+Media" alt="Missing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  }

  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <iframe 
        width="100%" 
        height="100%" 
        src={`https://www.youtube.com/embed/${ytId}${isLightbox ? '?autoplay=1' : '&mute=1&autoplay=1&controls=0&loop=1&playlist=' + ytId}`}
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen={isLightbox}
        style={{ 
          pointerEvents: isLightbox ? 'auto' : 'none', 
          border: 'none', 
          borderRadius: isLightbox ? '24px' : '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    );
  }

  const isVid = isVideoUrl(url);
  if (isVid) {
    return (
      <video 
        src={resolveImageUrl(url)} 
        autoPlay 
        muted={!isLightbox} 
        loop={!isLightbox}
        playsInline
        controls={isLightbox}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: isLightbox ? 'contain' : 'cover', 
          borderRadius: isLightbox ? '24px' : '0',
          maxHeight: isLightbox ? '80vh' : 'auto',
          pointerEvents: isLightbox ? 'auto' : 'none'
        }}
        onClick={isLightbox ? (e) => {
          e.stopPropagation();
          const video = e.target;
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        } : undefined}
      />
    );
  }

  // Fallback to image
  return (
    <img
      src={resolveImageUrl(url)}
      alt={photo.Caption || 'Gallery Media'}
      onError={(e) => { e.target.src = 'https://placehold.co/400x300/1a1a1a/ffffff?text=Link+Broken'; }}
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: isLightbox ? 'contain' : 'cover', 
        display: 'block', 
        pointerEvents: isLightbox ? 'auto' : 'none', 
        borderRadius: isLightbox ? '24px' : '0',
        maxWidth: isLightbox ? '95vw' : '100%',
        maxHeight: isLightbox ? '80vh' : '100%',
        boxShadow: isLightbox ? '0 40px 100px rgba(0,0,0,0.9)' : 'none'
      }}
      onClick={isLightbox ? (e) => e.stopPropagation() : undefined}
    />
  );
}

export default function PhotoGallery({ photos }) {
  const [lightbox, setLightbox] = useState(null);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!photos || photos.length === 0) return null;

  // Show newest photos first (last row of sheet = first in gallery)
  const sortedPhotos = [...photos].reverse();

  // Auto-sliding logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        if (el.scrollLeft >= maxScroll - 5) {
          // Reset to start if at end
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by one card width
          el.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(interval);
  }, [isPaused]);

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
          {renderMedia(lightbox, true)}
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

      {/* Scrollable Gallery */}
      <div 
        style={{ marginBottom: '4rem', position: 'relative' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.2rem',
            overflowX: 'auto',
            padding: '0.5rem 5% 1.5rem 5%',
            scrollSnapType: 'x proximity',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            cursor: 'grab'
          }}
          className="hide-scrollbar"
        >
          {sortedPhotos.map((photo, i) => (
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
              {renderMedia(photo, false)}
              {isVideoUrl(photo.Image_URL) || getYouTubeId(photo.Image_URL) ? (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'rgba(0,0,0,0.6)', padding: '0.4rem', borderRadius: '50%',
                  backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              ) : null}
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
          <div style={{ width: '5%', flexShrink: 0 }}></div>
        </div>

        <div style={{
          textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)',
          marginTop: '-0.5rem', opacity: 0.6
        }}>
          ← Auto-sliding (Swipe to browse manually) →
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
