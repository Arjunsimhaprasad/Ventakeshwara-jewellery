import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { RotateCw, Sparkles, Box, Info } from 'lucide-react';

// Lazy-load Three.js components to keep base bundle tiny
const CanvasLazy = lazy(() =>
  import('@react-three/fiber').then(mod => ({ default: mod.Canvas }))
);
const OrbitControlsLazy = lazy(() =>
  import('@react-three/drei').then(mod => ({ default: mod.OrbitControls }))
);

interface Product3DViewerProps {
  modelUrl?: string;
  images?: string[];
  productName: string;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({ modelUrl, images = [], productName }) => {
  const [activeTab, setActiveTab] = useState<'3d' | 'sprite'>(modelUrl ? '3d' : 'sprite');
  const [spriteFrame, setSpriteFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // Fallback high-res luxury angles array for drag-to-rotate sprite simulation
  const defaultSpriteAngles = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
  ];

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 15) {
      const direction = deltaX > 0 ? 1 : -1;
      setSpriteFrame(prev => {
        const next = prev + direction;
        if (next < 0) return defaultSpriteAngles.length - 1;
        if (next >= defaultSpriteAngles.length) return 0;
        return next;
      });
      startXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full aspect-square bg-[#0D131F] rounded-3xl overflow-hidden border border-gold-500/30 shadow-luxury flex flex-col justify-between">
      {/* Top Controls Bar */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex gap-2 glass-panel p-1 rounded-full">
          {modelUrl && (
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === '3d' ? 'bg-gold-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> 3D View
            </button>
          )}
          <button
            onClick={() => setActiveTab('sprite')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'sprite' ? 'bg-gold-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" /> 360° Drag Sprite
          </button>
        </div>

        <span className="glass-panel text-gold-300 text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold-400" /> Interactive View
        </span>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full h-full flex items-center justify-center">
        {activeTab === '3d' && modelUrl ? (
          <Suspense fallback={
            <div className="flex flex-col items-center gap-3 text-slate-400 text-sm">
              <RotateCw className="w-6 h-6 animate-spin text-gold-500" />
              <span>Loading 3D Gold Mesh Model...</span>
            </div>
          }>
            <CanvasLazy camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 10]} intensity={2.0} color="#FFF5D6" />
              <pointLight position={[-10, -10, -10]} intensity={0.8} />
              <mesh rotation={[0.4, 0.6, 0]}>
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
              </mesh>
              <OrbitControlsLazy enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </CanvasLazy>
          </Suspense>
        ) : (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none relative flex items-center justify-center p-8"
          >
            <img
              src={defaultSpriteAngles[spriteFrame]}
              alt={`${productName} Angle ${spriteFrame + 1}`}
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-100"
            />

            {/* Instruction Overlay Pill */}
            <div className="absolute bottom-4 z-10 glass-panel px-4 py-1.5 rounded-full text-slate-300 text-xs flex items-center gap-2 pointer-events-none">
              <RotateCw className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" /> Drag horizontally to rotate 360° ({spriteFrame + 1}/{defaultSpriteAngles.length})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
