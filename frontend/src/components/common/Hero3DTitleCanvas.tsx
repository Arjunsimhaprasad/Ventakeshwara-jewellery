import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, Crown, ShieldCheck, Gem, Compass, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load 3D Canvas to keep base bundle ultra fast
const CanvasLazy = lazy(() =>
  import('@react-three/fiber').then(mod => ({ default: mod.Canvas }))
);
const OrbitControlsLazy = lazy(() =>
  import('@react-three/drei').then(mod => ({ default: mod.OrbitControls }))
);

interface Hero3DTitleCanvasProps {
  onOpenAIChat: () => void;
}

export const Hero3DTitleCanvas: React.FC<Hero3DTitleCanvasProps> = ({ onOpenAIChat }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for classic 3D perspective tilt (§2a standard)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8 select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D WebGL Background Canvas with Metallic 22K Gold Jewels & Orbiting Shimmer */}
      <div className="absolute inset-0 z-0 opacity-75 pointer-events-auto">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-gold-500/40 border-t-gold-400 rounded-full animate-spin" />
            </div>
          }
        >
          <CanvasLazy camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[10, 10, 10]} intensity={2.5} color="#FFF3D1" />
            <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#D4AF37" />
            <pointLight position={[0, 0, 3]} intensity={1.5} color="#FFDF7B" />
            
            {/* 3D Animated Gold Crown Ornament Mesh */}
            <mesh rotation={[0.5, 0.4, 0]}>
              <torusKnotGeometry args={[1.1, 0.32, 128, 32]} />
              <meshStandardMaterial
                color="#D4AF37"
                metalness={0.96}
                roughness={0.12}
                wireframe={false}
              />
            </mesh>

            <OrbitControlsLazy
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={1.8}
            />
          </CanvasLazy>
        </Suspense>
      </div>

      {/* Atmospheric Gold Radiant Glow & Ambient Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0B0F17]/70 to-[#0B0F17]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 3D Animated Classic Card Container */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative z-10 max-w-5xl mx-auto text-center space-y-8 glass-panel-gold p-8 sm:p-14 rounded-3xl border border-gold-500/40 shadow-[0_20px_60px_rgba(212,175,55,0.15)]"
      >
        {/* Animated Heritage Crown Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/20 via-amber-500/30 to-gold-500/20 px-5 py-2 rounded-full text-gold-300 text-xs font-bold tracking-[0.25em] uppercase border border-gold-400/40 shadow-gold-glow"
        >
          <Crown className="w-4 h-4 text-gold-400 animate-pulse" />
          <span>Classic Royal Heritage • Est. 1978</span>
        </motion.div>

        {/* Main 3D Animated Title: Venkateshwara Jewellery */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
          >
            <span className="block text-slate-100 font-serif tracking-wider uppercase drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]">
              Venkateshwara
            </span>
            <span className="gold-gradient-text block mt-1 tracking-widest font-serif drop-shadow-[0_6px_20px_rgba(212,175,55,0.5)]">
              Jewellery
            </span>
          </motion.h1>

          {/* Subheader: Customised Jewellery 3D Shimmer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-2 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/90 via-amber-950/80 to-slate-900/90 border-2 border-gold-500/50 px-6 sm:px-10 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.25)]">
              <Gem className="w-5 h-5 text-gold-400 animate-spin-slow" />
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-widest uppercase text-gold-300 drop-shadow-[0_2px_10px_rgba(212,175,55,0.6)]">
                Customised Jewellery
              </span>
              <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Classic Craftsmanship Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-slate-200 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-sans leading-relaxed text-shadow"
        >
          Handcrafted 22K Temple Gold, VVS Solitaire Diamonds, and Bespoke Customised Bridal Collections engineered with 3D precision and certified with 100% BIS Hallmarking.
        </motion.p>

        {/* 3D Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
        >
          <Link
            to="/catalog"
            className="w-full sm:w-auto bg-gradient-to-r from-gold-500 via-amber-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-4 rounded-full text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>Explore Custom Collections</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>

          <button
            onClick={onOpenAIChat}
            className="w-full sm:w-auto glass-panel hover:bg-gold-500/20 text-gold-300 border border-gold-500/60 font-semibold px-8 py-4 rounded-full text-sm flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Sliders className="w-4 h-4 text-gold-400" />
            <span>Customise With AI Concierge</span>
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          </button>
        </motion.div>

        {/* Hallmarking Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 border-t border-gold-500/20"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-gold-400" /> 100% BIS Hallmarked 916 Gold
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Gem className="w-4 h-4 text-gold-400" /> Natural VVS Solitaire Diamonds
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Crown className="w-4 h-4 text-gold-400" /> Bespoke 3D Jewellery Design
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
