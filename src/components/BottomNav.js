'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const publicTabs = [
  { name: 'Home', path: '/', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { name: 'Programs', path: '/programs', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg> },
  { name: 'Results', path: '/results', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6v2h12V2zM12 19l-7-4V7h14v8l-7 4zm0-2.3l4-2.3V9H8v5.4l4 2.3z"/></svg> },
  { name: 'Teams', path: '/teams', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
  { name: 'Admin', path: '/admin', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg> },
];

const adminTabs = [
  { name: 'Teams', path: '/admin/teams', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
  { name: 'Members', path: '/admin/members', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
  { name: 'Programs', path: '/admin/programs', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg> },
  { name: 'Results', path: '/admin/results', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg> },
  { name: 'Settings', path: '/admin/settings', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin';
  const isLoginPage = pathname === '/login';

  const tabs = isAdminArea ? adminTabs : publicTabs;
  const TAB_W = 80;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = tabs.findIndex(tab => pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path) && tabs.find(t => t.path === tab.path)));
    if (index !== -1) setActiveIndex(index);
    else setActiveIndex(isAdminArea ? -1 : 0);
  }, [pathname, isAdminArea]);

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
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
    }}>
      {/* Liquid sliding bubble */}
      {activeIndex >= 0 && (
        <div style={{
          position: 'absolute',
          top: '0.4rem',
          bottom: '0.4rem',
          left: `calc(0.4rem + ${activeIndex * TAB_W}px)`,
          width: `${TAB_W}px`,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '32px',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 0
        }} />
      )}

      {tabs.map((tab, idx) => {
        const isActive = activeIndex === idx;
        return (
          <Link key={tab.path} href={tab.path} style={{
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${TAB_W}px`,
            height: '70px',
            color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s ease',
            gap: '4px',
            zIndex: 1,
            position: 'relative',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none'
          }}>
            <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {tab.icon}
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: isActive ? '600' : '500', opacity: isActive ? 1 : 0.7, transition: 'opacity 0.3s ease' }}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
