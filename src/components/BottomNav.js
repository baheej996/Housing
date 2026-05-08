'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Programs', path: '/programs', icon: '📅' },
    { name: 'Results', path: '/results', icon: '🏆' },
    { name: 'Teams', path: '/teams', icon: '👥' },
  ];

  if (pathname.startsWith('/admin') || pathname === '/login') return null;

  return (
    <nav style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: 'max-content',
      maxWidth: '90vw',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '50px',
      padding: '0.5rem',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      display: 'flex',
      gap: '0.5rem'
    }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link key={tab.path} href={tab.path} style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 1.5rem',
            borderRadius: '40px',
            color: isActive ? 'white' : 'var(--text-dim)',
            background: isActive ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: isActive ? '600' : '500',
            fontSize: '0.9rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
            <span style={{ display: isActive ? 'block' : 'none' }}>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
