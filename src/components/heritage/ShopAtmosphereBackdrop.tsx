"use client";

import { motion } from "motion/react";
import { IndianHeritageCanvas } from "@/components/heritage/IndianHeritageCanvas";
import { KolamLinework } from "@/components/motion/KolamLinework";

interface ShopAtmosphereBackdropProps {
  className?: string;
}

/**
 * Animated Indian Heritage Atmosphere for the Shopping Grid & Catalogue
 *
 * Implements:
 * 1. Fixed living 24K gold ember & marigold petal interactive particle canvas.
 * 2. Traditional rotating Rangoli/Kolam mandalas (8-fold and 16-fold geometry).
 * 3. Indian architectural Jali screen lattice shadows with animated sunlight caustics.
 * 4. Pichwai lotus & royal court miniature art watermarks.
 * 5. Warm royal Mysore gold, saffron, and madder terracotta ambient halos.
 */
export function ShopAtmosphereBackdrop({ className = "" }: ShopAtmosphereBackdropProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Warm Royal Parchment Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE3] to-[#EFE7D5]" />

      {/* 2. Interactive Gold Embers & Marigold Petal Particle Canvas */}
      <div className="absolute inset-0 opacity-60">
        <IndianHeritageCanvas intensity="rich" interactive={true} />
      </div>

      {/* 3. Ambient Saffron, Mysore Gold & Terracotta Halos */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.28, 0.18],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-[550px] h-[550px] bg-[#C5A059]/15 rounded-full blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-10 w-[650px] h-[650px] bg-[#8A2E1E]/12 rounded-full blur-[160px]"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.14, 0.24, 0.14],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-[#D4AF37]/14 rounded-full blur-[150px]"
      />

      {/* 4. Traditional Indian Architectural Jali Screen Lattice Overlay */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #8A5D3B 2.5px, transparent 3px),
            linear-gradient(45deg, transparent 48%, rgba(138,93,59,0.38) 49%, rgba(138,93,59,0.38) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(138,93,59,0.38) 49%, rgba(138,93,59,0.38) 51%, transparent 52%)
          `,
          backgroundSize: "44px 44px, 88px 88px, 88px 88px",
        }}
      />

      {/* 5. Shifting Sunlight Caustics Moving Diagonally Across Viewport */}
      <motion.div
        animate={{
          x: ["-15%", "15%", "-15%"],
          y: ["-8%", "12%", "-8%"],
          opacity: [0.2, 0.38, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 w-[160%] h-[160%] bg-gradient-to-tr from-transparent via-[#FFF6D8]/45 to-transparent blur-3xl"
      />

      {/* 6. Rotating Rangoli & Kolam Sacred Geometry Mandalas */}
      {/* Top Left Spinning Rangoli Mandala */}
      <div className="absolute top-16 left-6 opacity-30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        >
          <KolamLinework size={280} variant="medallion" tone="brass" animated={false} />
        </motion.div>
      </div>

      {/* Top Right Spinning Rangoli Mandala */}
      <div className="absolute top-28 right-8 opacity-30">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
        >
          <KolamLinework size={320} variant="medallion" tone="gold" animated={false} />
        </motion.div>
      </div>

      {/* Middle Left Floating Rangoli Mandala */}
      <div className="absolute top-1/2 -left-16 opacity-25 hidden lg:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
        >
          <KolamLinework size={340} variant="medallion" tone="brass" animated={false} />
        </motion.div>
      </div>

      {/* Middle Right Floating Rangoli Mandala */}
      <div className="absolute top-2/3 -right-16 opacity-25 hidden lg:block">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 105, repeat: Infinity, ease: "linear" }}
        >
          <KolamLinework size={360} variant="medallion" tone="gold" animated={false} />
        </motion.div>
      </div>

      {/* Bottom Center Floating Rangoli */}
      <div className="absolute bottom-12 left-1/3 opacity-20 hidden md:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <KolamLinework size={300} variant="medallion" tone="brass" animated={false} />
        </motion.div>
      </div>

      {/* 7. Pichwai Traditional Indian Lotus & Royal Vines Watermarks */}
      <svg
        className="absolute bottom-6 left-6 w-[450px] h-[450px] opacity-20 pointer-events-none stroke-[#8A5D3B] fill-none"
        viewBox="0 0 400 400"
      >
        <path d="M 0 380 Q 90 290 170 330 T 320 260" strokeWidth="1.8" />
        <path d="M 170 330 Q 220 210 270 160" strokeWidth="1.4" strokeDasharray="4 4" />
        <circle cx="270" cy="160" r="28" strokeWidth="1.8" fill="#C5A059" fillOpacity="0.15" />
        <circle cx="170" cy="330" r="16" strokeWidth="1.2" fill="#8A2E1E" fillOpacity="0.15" />
        {/* Lotus Petals Geometry */}
        <path d="M 270 132 C 285 145 285 175 270 188 C 255 175 255 145 270 132 Z" fill="#D4AF37" fillOpacity="0.2" />
        <path d="M 242 160 C 255 145 285 145 298 160 C 285 175 255 175 242 160 Z" fill="#D4AF37" fillOpacity="0.2" />
      </svg>

      <svg
        className="absolute top-1/4 right-8 w-[380px] h-[380px] opacity-20 pointer-events-none stroke-[#8A5D3B] fill-none"
        viewBox="0 0 400 400"
      >
        <path d="M 400 40 Q 310 110 230 70 T 80 140" strokeWidth="1.8" />
        <circle cx="230" cy="70" r="24" strokeWidth="1.8" fill="#C5A059" fillOpacity="0.15" />
        <path d="M 230 46 C 243 57 243 83 230 94 C 217 83 217 57 230 46 Z" fill="#D4AF37" fillOpacity="0.2" />
      </svg>

      {/* 8. Antique Moradabad Brass Border Filigree along left and right edges */}
      <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-[#C5A059]/0 via-[#C5A059]/35 to-[#C5A059]/0" />
      <div className="absolute top-0 bottom-0 right-0 w-[3px] bg-gradient-to-b from-[#C5A059]/0 via-[#C5A059]/35 to-[#C5A059]/0" />
    </div>
  );
}
