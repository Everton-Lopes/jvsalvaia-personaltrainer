import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Instagram, ArrowUpRight, Play } from 'lucide-react';
import { TRAINING_EXERCISES_DATA } from '../data/trainerData';

interface SpotlightCardProps {
  children: React.ReactNode;
  href: string;
  ariaLabel: string;
}

const TrainingCardWithSpotlight: React.FC<SpotlightCardProps> = ({ children, href, ariaLabel }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 hover:border-transparent overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.7),0_0_12px_rgba(204,255,0,0.12)] flex flex-col justify-between cursor-pointer rounded-2xl h-full"
    >
      {/* Ambient subtle hint */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.02)_0%,transparent_60%)]"
        aria-hidden="true"
      />

      {/* Dynamic Cursor Spotlight: Refined brand neon (#CCFF00) accent */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-200 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, 0.08) 0%, rgba(16, 185, 129, 0.05) 35%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Dynamic Dual-Tone Border Glow following cursor - refined and sharp */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, 0.55) 0%, rgba(16, 185, 129, 0.35) 45%, transparent 75%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1.5px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">{children}</div>
    </a>
  );
};

export const TrainingGallery: React.FC = () => {
  const [imageAttempts, setImageAttempts] = useState<Record<string, number>>({});

  const handleImageError = (id: string) => {
    setImageAttempts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div id="treinos" className="scroll-mt-28 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="inline-block px-4 py-1.5 border border-[#CCFF00] text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#CCFF00]/10 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(204,255,0,0.15)]">
          03 // EXECUÇÃO &amp; TÉCNICA
        </span>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter text-white uppercase leading-none text-enhance-heading">
          TREINOS NA <span className="text-[#CCFF00]">PRÁTICA</span>
        </h3>
        <div className="w-14 h-[3px] bg-gradient-to-r from-emerald-400 via-[#CCFF00] to-emerald-400 mx-auto shadow-[0_0_10px_#CCFF00] rounded-full" />
        <p className="text-base sm:text-lg text-white/85 font-medium max-w-2xl mx-auto leading-relaxed text-enhance-subheading">
          Biomecânica aplicada, amplitude adequada e progressão real. Veja na prática execuções de treinos com o João Victor.
        </p>
      </motion.div>

      {/* 4 Cards Grid with staggered scroll animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRAINING_EXERCISES_DATA.map((item, idx) => {
          const attempts = imageAttempts[item.id] || 0;
          const currentSrc =
            attempts === 0
              ? item.photoUrl
              : attempts === 1 && item.fallbackPhotoUrl
              ? item.fallbackPhotoUrl
              : null;
          const numPrefix = `0${idx + 1}/`;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <TrainingCardWithSpotlight
                href={item.instagramUrl}
                ariaLabel={`Ver execução de ${item.title} no Instagram`}
              >
                {/* Image Container taking approx 70% of card height */}
                <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-[#141414] shrink-0">
                  {currentSrc ? (
                    <img
                      src={currentSrc}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(item.id)}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* Branded technical fallback if direct photo file cannot be loaded */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d0d0d]">
                      <div className="w-14 h-14 bg-black border border-[#CCFF00] flex items-center justify-center text-[#CCFF00] mb-3 shadow-[0_0_15px_rgba(204,255,0,0.25)] group-hover:scale-110 transition-transform rounded-xl">
                        <Instagram className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <span className="text-[11px] text-[#CCFF00] font-mono mt-1 uppercase tracking-wider">
                        Toque para assistir
                      </span>
                    </div>
                  )}

                  {/* Dark Vignette Overlay for maximum contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent pointer-events-none" />

                  {/* Instagram Play Badge on Top Corner */}
                  <div className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/80 backdrop-blur-md border border-emerald-500/40 flex items-center justify-center text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-colors shadow-lg rounded-full">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>

                  {/* Tag and Index on Image Bottom */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#CCFF00] bg-black/90 px-3 py-1 border border-emerald-500/40 font-bold uppercase tracking-widest rounded-full">
                      {numPrefix} {item.tag}
                    </span>
                  </div>
                </div>

                {/* Text Information Centralizada */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4 text-center">
                  <div className="space-y-2">
                    <h4 className="text-lg sm:text-xl text-white uppercase font-black italic tracking-tight group-hover:text-[#CCFF00] transition-colors leading-tight text-center">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-white/80 font-medium leading-relaxed text-center">
                      {item.description}
                    </p>
                  </div>

                  {/* Link Action Centralizada */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 group-hover:text-[#CCFF00] uppercase tracking-widest mt-auto transition-colors text-center">
                    <span>ASSISTIR NO INSTAGRAM</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </TrainingCardWithSpotlight>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
