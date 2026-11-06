import React, { useEffect, useRef } from 'react';
import { useAesthetic } from '../context/AestheticContext';

interface CameraLensCanvasProps {
  className?: string;
  brandName?: string;
}

export const CameraLensCanvas: React.FC<CameraLensCanvasProps> = ({ 
  className = '',
  brandName = 'SAI GRAPHICS'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, config, mode } = useAesthetic();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Particle system for floating cinematic bokeh & dust
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.4 - 0.15,
      color: Math.random() > 0.4 ? config.lensGradient[0] : config.lensGradient[1]
    }));

    let rotationAngle = 0;
    let apertureBladeAngle = 0;
    let nameFloatOffset = 0;

    const render = () => {
      // Smooth mouse interpolation for 3D parallax tilt
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const tiltX = (mouseX / width - 0.5) * 50;
      const tiltY = (mouseY / height - 0.5) * 40;

      ctx.clearRect(0, 0, width, height);

      // Render Floating Cinematic Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
      });

      // Camera Lens Center Position (Right-leaning for split hero, responsive)
      const isMobile = width < 768;
      const lensCenterX = isMobile ? width * 0.5 + (tiltX * 0.5) : width * 0.72 + tiltX;
      const lensCenterY = isMobile ? height * 0.65 + (tiltY * 0.5) : height * 0.48 + tiltY;
      const baseRadius = isMobile ? Math.min(width, height) * 0.35 : Math.min(width, height) * 0.42;

      rotationAngle += 0.0025;
      apertureBladeAngle = Math.sin(rotationAngle * 1.5) * 0.12;
      nameFloatOffset = Math.sin(rotationAngle * 10) * 8;

      // --- BRAND NAME FLOATING BEHIND LENS ---
      if (!isMobile) {
        ctx.save();
        // The name moves in the opposite direction of tilt to create "parallax depth"
        const nameX = lensCenterX - tiltX * 1.5;
        const nameY = lensCenterY - tiltY * 1.5 + nameFloatOffset;
        
        ctx.translate(nameX, nameY);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 1. Shadow/Glow under the name
        ctx.font = '900 120px "Cinzel", serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.03)';
        ctx.fillText(brandName, 0, 0);

        // 2. Main Name Rendering
        ctx.font = '700 80px "Cinzel", serif';
        const nameGrad = ctx.createLinearGradient(-300, 0, 300, 0);
        const nameColor = mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
        const accentColor = mode === 'light' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.12)';
        nameGrad.addColorStop(0, nameColor);
        nameGrad.addColorStop(0.5, accentColor);
        nameGrad.addColorStop(1, nameColor);
        ctx.fillStyle = nameGrad;
        ctx.fillText(brandName, 0, 0);

        // 3. Subtle stroke for definition
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeText(brandName, 0, 0);
        ctx.restore();
      }

      ctx.save();
      ctx.translate(lensCenterX, lensCenterY);

      // 1. Ambient Outer Lens Glow & Optical Backing
      const ambientGlow = ctx.createRadialGradient(0, 0, baseRadius * 0.3, 0, 0, baseRadius * 1.6);
      ambientGlow.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      ambientGlow.addColorStop(0.5, 'rgba(212, 175, 55, 0.06)');
      ambientGlow.addColorStop(1, mode === 'light' ? 'rgba(248, 250, 252, 0)' : 'rgba(8, 9, 13, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Anodized Aluminum Barrel Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 14;
      ctx.stroke();

      // 3. Metallic Gold Accent Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.94, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 4. Focus Scale Knurling Notches
      const notches = 48;
      for (let i = 0; i < notches; i++) {
        const angle = (i * Math.PI * 2) / notches + rotationAngle * 0.2;
        const r1 = baseRadius * 0.95;
        const r2 = i % 4 === 0 ? baseRadius * 0.98 : baseRadius * 0.965;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.strokeStyle = i % 4 === 0 ? 'rgba(212, 175, 55, 0.65)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = i % 4 === 0 ? 2 : 1;
        ctx.stroke();
      }

      // 5. Engraved Lens Specs Text (Rotating)
      ctx.save();
      ctx.rotate(rotationAngle * 0.4);
      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(243, 229, 171, 0.75)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textRadius = baseRadius * 0.86;

      const specs = [
        `MASTER ${brandName} OPTICS`,
        '85mm F/1.2 CINEMA ED',
        'MULTI-COATED GLASS',
        'BHAGALPUR STUDIO'
      ];
      specs.forEach((spec, idx) => {
        const segAngle = (idx * Math.PI) / 2;
        ctx.save();
        ctx.rotate(segAngle);
        ctx.fillText(spec, 0, -textRadius);
        ctx.restore();
      });
      ctx.restore();

      // 6. Deep Optical Barrel Interior
      const barrelGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.1, 0, 0, baseRadius * 0.8);
      barrelGrad.addColorStop(0, 'rgba(4, 5, 8, 0.95)');
      barrelGrad.addColorStop(0.7, 'rgba(11, 14, 22, 0.85)');
      barrelGrad.addColorStop(1, 'rgba(20, 24, 35, 0.9)');
      ctx.fillStyle = barrelGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // 7. Aperture Blades (8 Multi-Segment Iris Mechanism)
      const bladeCount = 8;
      const bladeInnerRadius = baseRadius * 0.32;
      const bladeOuterRadius = baseRadius * 0.76;

      ctx.save();
      ctx.rotate(rotationAngle * 0.6 + apertureBladeAngle);
      for (let i = 0; i < bladeCount; i++) {
        const a = (i * Math.PI * 2) / bladeCount;
        ctx.save();
        ctx.rotate(a);

        ctx.beginPath();
        ctx.moveTo(bladeInnerRadius, 0);
        ctx.lineTo(bladeOuterRadius, -bladeOuterRadius * 0.25);
        ctx.lineTo(bladeOuterRadius, bladeOuterRadius * 0.35);
        ctx.closePath();

        ctx.fillStyle = i % 2 === 0 ? 'rgba(18, 20, 28, 0.88)' : 'rgba(25, 28, 38, 0.88)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // 8. Optical Center Glass Element (Electric Blue & Magenta Multi-Coating Sheen)
      const glassGlow = ctx.createRadialGradient(
        -baseRadius * 0.08,
        -baseRadius * 0.08,
        0,
        0,
        0,
        baseRadius * 0.4
      );
      glassGlow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      glassGlow.addColorStop(0.4, 'rgba(168, 85, 247, 0.25)');
      glassGlow.addColorStop(0.8, 'rgba(14, 165, 233, 0.1)');
      glassGlow.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = glassGlow;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // 9. Diagonal Glass Reflection / Optical Flares
      ctx.save();
      ctx.rotate(-Math.PI / 4 + rotationAngle * 0.1);
      const sheenGrad = ctx.createLinearGradient(-baseRadius * 0.7, 0, baseRadius * 0.7, 0);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.03)');
      sheenGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.22)');
      sheenGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.18)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, config.lensGradient, brandName, mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
