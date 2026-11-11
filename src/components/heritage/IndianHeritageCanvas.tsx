"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface IndianHeritageCanvasProps {
  className?: string;
  intensity?: "subtle" | "rich" | "festive";
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  hue: number;
  twinkleSpeed: number;
  angle: number;
  type: "ember" | "petal" | "dust";
}

interface MouseTrail {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedX: number;
  speedY: number;
  life: number;
}

export function IndianHeritageCanvas({
  className = "",
  intensity = "rich",
  interactive = true,
}: IndianHeritageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<MouseTrail[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool: 24K Gold Embers + Sacred Lotus Petals + Shimmer Dust
    const particleCount = intensity === "festive" ? 65 : intensity === "rich" ? 44 : 26;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const isPetal = i % 14 === 0;
      const isDust = i % 4 === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? Math.random() * 4 + 3 : isDust ? Math.random() * 1.4 + 0.6 : Math.random() * 2.4 + 1.2,
        speedY: isPetal ? (Math.random() * 0.35 + 0.2) : -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: isPetal ? Math.random() * 0.4 + 0.2 : Math.random() * 0.7 + 0.3,
        hue: isPetal ? (Math.random() > 0.5 ? 12 : 350) : Math.random() > 0.35 ? 42 : 36, // Warm gold or lotus vermillion
        twinkleSpeed: Math.random() * 0.03 + 0.012,
        angle: Math.random() * Math.PI * 2,
        type: isPetal ? "petal" : isDust ? "dust" : "ember",
      };
    });

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Mouse Stardust Trails
      const trails = trailsRef.current;
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.speedX;
        t.y += t.speedY;
        t.life -= 0.025;
        t.alpha = Math.max(0, t.life);

        if (t.life <= 0) {
          trails.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 127, ${t.alpha * 0.8})`;
        ctx.shadowColor = "rgba(255, 230, 150, 0.9)";
        ctx.shadowBlur = t.size * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Render Floating 24K Gold Embers and Lotus Petals
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(frame * 0.015 + p.angle) * 0.25;
        p.angle += p.twinkleSpeed;

        // Wrap around boundaries
        if (p.speedY < 0 && p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        } else if (p.speedY > 0 && p.y > height + 15) {
          p.y = -15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        const currentOpacity = Math.abs(Math.sin(p.angle)) * p.opacity;

        if (p.type === "petal") {
          // Render graceful drifting lotus petal
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.8);
          ctx.bezierCurveTo(p.size, -p.size, p.size, p.size, 0, p.size * 1.8);
          ctx.bezierCurveTo(-p.size, p.size, -p.size, -p.size, 0, -p.size * 1.8);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${currentOpacity * 0.6})`;
          ctx.shadowColor = "rgba(180, 50, 40, 0.35)";
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
        } else {
          // Glittering 24K gold fleck
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 66%, ${currentOpacity})`;
          ctx.shadowColor = "rgba(240, 205, 110, 0.85)";
          ctx.shadowBlur = p.size * 3.5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (auroraRef.current) {
      auroraRef.current.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      auroraRef.current.style.setProperty("--my", `${(y / rect.height) * 100}%`);
    }

    // Spawn 1-2 interactive stardust particles on motion
    if (trailsRef.current.length < 45) {
      trailsRef.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        size: Math.random() * 2 + 1,
        alpha: 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        life: 1,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* 1. Deep Royal Jewel-Tone Ambient Mesh Aurora */}
      <div
        ref={auroraRef}
        className="absolute inset-0 opacity-85 transition-opacity duration-700 ease-out"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at var(--mx, 50%) var(--my, 50%), rgba(202, 163, 89, 0.22) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 88% 12%, rgba(138, 46, 30, 0.16) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 12% 88%, rgba(11, 37, 44, 0.18) 0%, transparent 65%),
            radial-gradient(ellipse 80% 80% at 50% 50%, rgba(247, 241, 230, 0.82) 0%, rgba(235, 222, 202, 0.96) 100%)
          `,
        }}
      />

      {/* 2. Sacred Hoysala & Vijayanagara Celestial Mandalas (Clockwise & Counter-Clockwise) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        className="absolute -top-36 -right-36 w-[650px] h-[650px] sm:w-[900px] sm:h-[900px] opacity-[0.065] pointer-events-none text-espresso"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full fill-none stroke-current" strokeWidth="0.85">
          {/* Concentric Sacred Hoysala Star Rings */}
          <circle cx="200" cy="200" r="185" strokeDasharray="3 3" />
          <circle cx="200" cy="200" r="170" />
          <circle cx="200" cy="200" r="155" strokeDasharray="6 4" />
          <circle cx="200" cy="200" r="130" />
          <circle cx="200" cy="200" r="100" strokeDasharray="2 4" />
          <circle cx="200" cy="200" r="70" />
          <circle cx="200" cy="200" r="40" />

          {/* 16-Rayed Sacred Lotus Geometry */}
          {Array.from({ length: 16 }).map((_, i) => {
            const rot = i * 22.5;
            return (
              <g key={i} transform={`rotate(${rot} 200 200)`}>
                <path d="M 200 30 Q 212 110 200 170 Q 188 110 200 30 Z" />
                <path d="M 200 70 Q 208 130 200 170 Q 192 130 200 70 Z" />
                <circle cx="200" cy="25" r="3.5" fill="currentColor" fillOpacity="0.4" />
                <polygon points="197,140 200,130 203,140" fill="currentColor" fillOpacity="0.3" />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Counter-rotating subtle lotus mandala on bottom left */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] opacity-[0.045] pointer-events-none text-[#8a2e1e]"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full fill-none stroke-current" strokeWidth="0.8">
          <circle cx="200" cy="200" r="175" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="100" strokeDasharray="3 5" />
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 200 200)`}>
              <path d="M 200 40 Q 215 120 200 180 Q 185 120 200 40 Z" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* 3. Intricate Mughal / Rajputana Jaali Grid Lattice Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 10px 10px, #30251e 1.2px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. Canvas for Real-Time Floating 24K Gold Dust Embers & Trails */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
