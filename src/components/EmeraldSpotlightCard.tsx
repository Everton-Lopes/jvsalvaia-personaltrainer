import React, { useState, useRef } from 'react';

interface EmeraldSpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  emeraldIntensity?: 'subtle' | 'standard' | 'high';
  borderGlow?: boolean;
}

export const EmeraldSpotlightCard: React.FC<EmeraldSpotlightCardProps> = ({
  children,
  className = '',
  contentClassName = '',
  emeraldIntensity = 'standard',
  borderGlow = true,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Calibrate precise brand neon (#CCFF00) accents based on intensity (refined, non-invasive)
  const neonOpacity =
    emeraldIntensity === 'high' ? 0.07 : emeraldIntensity === 'subtle' ? 0.025 : 0.045;
  const emeraldOpacity =
    emeraldIntensity === 'high' ? 0.04 : emeraldIntensity === 'subtle' ? 0.015 : 0.025;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 hover:border-transparent transition-all duration-300 rounded-2xl hover:shadow-[0_8px_25px_rgba(0,0,0,0.7)] ${className}`}
      {...rest}
    >
      {/* 
        INTERNAL CONTAINER FOR GLOW EFFECTS:
        Clips lighting gradients cleanly to the rounded card corners without clipping exterior badges.
      */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
        {/* 
          DYNAMIC CURSOR SPOTLIGHT: Refined, localized illumination strictly where cursor hovers
        */}
        <div
          className="absolute -inset-px transition-opacity duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, ${neonOpacity}) 0%, rgba(16, 185, 129, ${emeraldOpacity}) 40%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Dynamic Dual-Tone Border Glow following cursor - refined and sharp */}
        {borderGlow && (
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, 0.4) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 75%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card Content */}
      <div className={`z-10 h-full flex flex-col justify-between ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
