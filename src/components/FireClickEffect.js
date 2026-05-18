'use client';
import { useEffect, useRef } from 'react';

export default function FireClickEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    let particles = [];

    class Particle {
      constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'flame' or 'spark'
        
        // Random angle, biased upwards
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8; 
        const speed = type === 'spark' ? Math.random() * 8 + 3 : Math.random() * 4 + 1;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Extra scatter for sparks
        if (type === 'spark') {
           this.vx += (Math.random() - 0.5) * 10;
           this.vy -= Math.random() * 5;
        }

        this.life = 0;
        this.maxLife = type === 'spark' ? Math.random() * 40 + 20 : Math.random() * 45 + 25;
        this.baseSize = type === 'spark' ? Math.random() * 3 + 1 : Math.random() * 30 + 15;
        this.size = this.baseSize;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Heat rises naturally, add upward buoyancy
        this.vy -= 0.15;
        
        // Air resistance
        this.vx *= 0.92;
        this.vy *= 0.95;
        
        this.life++;
        
        // Flame particles grow slightly then shrink
        const progress = this.life / this.maxLife;
        if (this.type === 'flame') {
          if (progress < 0.2) {
            this.size = this.baseSize * (1 + progress * 2);
          } else {
            this.size = this.baseSize * (1 - (progress - 0.2) * 1.25);
          }
        } else {
          this.size *= 0.95; // Sparks just shrink
        }
      }

      draw(ctx) {
        if (this.life >= this.maxLife || this.size < 0.5) return;
        
        const progress = this.life / this.maxLife;
        const opacity = Math.max(0, 1 - progress);
        
        let colorStr = '';
        if (this.type === 'spark') {
          colorStr = `rgba(255, 230, 150, ${opacity})`;
        } else {
          // Temperature gradient (Blue -> Yellow -> Orange -> Red -> Black)
          if (progress < 0.1) {
            colorStr = `rgba(100, 200, 255, ${opacity * 0.8})`; // Blue hot core
          } else if (progress < 0.3) {
            colorStr = `rgba(255, 240, 150, ${opacity})`; // White/Yellow
          } else if (progress < 0.6) {
            colorStr = `rgba(255, 120, 30, ${opacity})`; // Orange
          } else {
            colorStr = `rgba(220, 30, 10, ${opacity})`; // Red/Ember
          }
        }

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, colorStr);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const spawnFire = (x, y) => {
      // Spawn flames
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x + (Math.random() - 0.5) * 15, y + (Math.random() - 0.5) * 15, 'flame'));
      }
      // Spawn sparks
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, 'spark'));
      }
    };

    let isPointerDown = false;
    let lastX = 0;
    let lastY = 0;

    const handlePointerDown = (e) => {
      isPointerDown = true;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if (x && y) {
        spawnFire(x, y);
        lastX = x;
        lastY = y;
      }
    };

    const handlePointerMove = (e) => {
      if (!isPointerDown) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if (x && y) {
        const dist = Math.hypot(x - lastX, y - lastY);
        // Spawn fire trail
        if (dist > 15) {
           spawnFire(x, y);
           lastX = x;
           lastY = y;
        }
      }
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, {passive: true});
    window.addEventListener('touchmove', handlePointerMove, {passive: true});
    window.addEventListener('touchend', handlePointerUp);

    let animationFrameId;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'lighter';
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life >= p.maxLife || p.size < 0.5) {
          particles.splice(i, 1);
        }
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999, // Ensure it's on top of everything
      }}
    />
  );
}
