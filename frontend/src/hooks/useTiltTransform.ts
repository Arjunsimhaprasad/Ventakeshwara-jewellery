import { useState, useEffect, useCallback, MouseEvent } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export function useTiltTransform(maxTiltDeg = 7, scaleOnHover = 1.02) {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handlePointerMove = useCallback((e: MouseEvent<HTMLElement>) => {
    if (isReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate cursor position relative to card center (-1 to 1)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const percentX = (mouseX / width) - 0.5;
    const percentY = (mouseY / height) - 0.5;

    // RotateX is inverted relative to Y offset
    const rotateX = -percentY * (maxTiltDeg * 2);
    const rotateY = percentX * (maxTiltDeg * 2);

    setTilt({
      rotateX: Number(rotateX.toFixed(2)),
      rotateY: Number(rotateY.toFixed(2)),
      scale: scaleOnHover
    });
  }, [maxTiltDeg, scaleOnHover, isReducedMotion]);

  const handlePointerLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return {
    tiltStyle: isReducedMotion ? {} : {
      transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, 1)`,
      transition: tilt.rotateX === 0 && tilt.rotateY === 0 ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
      willChange: 'transform'
    },
    handlePointerMove,
    handlePointerLeave
  };
}
