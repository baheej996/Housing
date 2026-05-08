'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> 
    },
    { 
      name: 'Programs', 
      path: '/programs', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg> 
    },
    { 
      name: 'Results', 
      path: '/results', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6v2h12V2zM12 19l-7-4V7h14v8l-7 4zm0-2.3l4-2.3V9H8v5.4l4 2.3z"/></svg> 
    },
    { 
      name: 'Teams', 
      path: '/teams', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> 
    },
  ];

  if (pathname.startsWith('/admin') || pathname === '/login') return null;

  return (
    <nav style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: 'rgba(20, 20, 25, 0.7)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '40px',
      padding: '0.4rem',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
    }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link key={tab.path} href={tab.path} style={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '85px',
            height: '70px',
            borderRadius: '32px',
            color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
            background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
            transition: 'all 0.3s ease',
            gap: '4px'
          }}>
            <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: '0.3s' }}>
              {tab.icon}
            </div>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: isActive ? '600' : '500',
              opacity: isActive ? 1 : 0.7
            }}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
