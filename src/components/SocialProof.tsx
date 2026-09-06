import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, TrendingUp, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/trainerData';
import { EmeraldSpotlightCard } from './EmeraldSpotlightCard';

export const SocialProof: React.FC = () => {
  // Current active index for mobile/tablet (0 to 5 for all 6 testimonials)
  // For desktop, it dictates the sliding window of 3 cards
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalItems = TESTIMONIALS_DATA.length; // 6

  // Forward navigation (circular loop)
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  // Backward navigation (circular loop)
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Touch handlers for mobile & tablet swipe gesture
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // Threshold in pixels

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Desktop visible window: 3 items starting from currentIndex, wrapping around seamlessly
  const desktopVisibleItems = [
    TESTIMONIALS_DATA[currentIndex % totalItems],
    TESTIMONIALS_DATA[(currentIndex + 1) % totalItems],
    TESTIMONIALS_DATA[(currentIndex + 2) % totalItems],
  ];

  return (
    <div id="prova-social" className="scroll-mt-28 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="inline-block px-4 py-1.5 border border-[#CCFF00] text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#CCFF00]/10 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(204,255,0,0.15)]">
          04 // DEPOIMENTOS REAIS (6 ALUNOS)
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          QUEM TREINA, <span className="text-[#CCFF00]">EVOLUI.</span>
        </h2>
        <div className="w-14 h-[3px] bg-gradient-to-r from-emerald-500 via-[#CCFF00] to-emerald-400 mx-auto shadow-[0_0_12px_#CCFF00] rounded-full" />
        <p className="text-base sm:text-lg text-white/80 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
          Resultados e relatos de alunos reais que treinam com acompanhamento focado em biomecânica, técnica e progressão de cargas.
        </p>
      </motion.div>

      {/* 
        CARROSSEL INTERATIVO COM ILUMINAÇÃO EM VERDE ESMERALDA
        Suporta arrastar com touch (swipe left/right) e clique nas setas tanto para frente quanto para trás.
      */}
      <div
        className="relative touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* DESKTOP VIEW: 3 cards simultâneos com transição fluida mostrando todos os 6 depoimentos */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {desktopVisibleItems.map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="h-full"
            >
              <EmeraldSpotlightCard
                className="h-full p-6 sm:p-7 border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)]"
                emeraldIntensity="standard"
              >
                {/* Header with stars and badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#CCFF00]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#CCFF00] border border-emerald-500/40 px-2.5 py-0.5 bg-emerald-500/10 rounded-full font-bold">
                    ALUNO VERIFICADO
                  </span>
                </div>

                {/* Quote Text Centralizado */}
                <div className="flex-1 mb-6 py-1 relative text-center">
                  <p className="text-sm text-white/90 italic leading-relaxed font-medium text-center">
                    "{item.text}"
                  </p>
                </div>

                {/* Author Information Centralizada */}
                <div className="pt-4 border-t border-white/10 space-y-2 mt-auto flex flex-col items-center text-center">
                  <div className="text-center">
                    <h4 className="text-base text-white uppercase font-black italic tracking-tight group-hover:text-[#CCFF00] transition-colors text-center">
                      {item.name}
                    </h4>
                    <p className="text-xs text-white/60 font-mono uppercase tracking-wider mt-0.5 text-center">
                      {item.context}
                    </p>
                  </div>

                  {item.result && (
                    <div className="inline-flex items-center justify-center gap-1.5 border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs text-[#CCFF00] font-mono font-bold uppercase tracking-wider rounded-full shadow-sm text-center">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.result}</span>
                    </div>
                  )}
                </div>
              </EmeraldSpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* TABLET VIEW: 2 cards simultâneos com navegação completa por todos os 6 */}
        <div className="hidden sm:grid lg:hidden sm:grid-cols-2 gap-5">
          {[
            TESTIMONIALS_DATA[currentIndex % totalItems],
            TESTIMONIALS_DATA[(currentIndex + 1) % totalItems],
          ].map((item, idx) => (
            <motion.div
              key={`${item.id}-tab-${idx}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <EmeraldSpotlightCard
                className="h-full p-6 border border-white/10 hover:border-emerald-500/50 shadow-xl"
                emeraldIntensity="high"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#CCFF00]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#CCFF00] border border-emerald-500/40 px-2 py-0.5 bg-emerald-500/10 rounded-full font-bold">
                    VERIFICADO
                  </span>
                </div>

                <div className="flex-1 mb-5 py-1 text-center">
                  <p className="text-sm text-white/90 italic leading-relaxed font-medium text-center">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 mt-auto flex flex-col items-center text-center">
                  <div className="text-center">
                    <h4 className="text-base text-white uppercase font-black italic tracking-tight text-center">
                      {item.name}
                    </h4>
                    <p className="text-xs text-white/60 font-mono uppercase tracking-wider mt-0.5 text-center">
                      {item.context}
                    </p>
                  </div>

                  {item.result && (
                    <div className="inline-flex items-center justify-center gap-1.5 border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs text-[#CCFF00] font-mono font-bold uppercase tracking-wider rounded-full text-center">
                      <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item.result}</span>
                    </div>
                  )}
                </div>
              </EmeraldSpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* MOBILE VIEW: 1 card por vez com suporte completo a gesto de arraste (touch swipe) e setas */}
        <div className="sm:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={TESTIMONIALS_DATA[currentIndex].id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
            >
              <EmeraldSpotlightCard
                className="p-6 border border-white/15 shadow-2xl"
                emeraldIntensity="high"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#CCFF00]">
                    {[...Array(TESTIMONIALS_DATA[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#CCFF00] border border-emerald-500/40 px-2.5 py-0.5 bg-emerald-500/10 rounded-full font-bold">
                    ALUNO VERIFICADO
                  </span>
                </div>

                <div className="py-1 mb-5 text-center">
                  <p className="text-sm text-white/90 italic leading-relaxed font-medium text-center">
                    "{TESTIMONIALS_DATA[currentIndex].text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 flex flex-col items-center text-center">
                  <div className="text-center">
                    <h4 className="text-base text-white uppercase font-black italic tracking-tight text-center">
                      {TESTIMONIALS_DATA[currentIndex].name}
                    </h4>
                    <p className="text-xs text-white/60 font-mono uppercase tracking-wider mt-0.5 text-center">
                      {TESTIMONIALS_DATA[currentIndex].context}
                    </p>
                  </div>

                  {TESTIMONIALS_DATA[currentIndex].result && (
                    <div className="inline-flex items-center justify-center gap-1.5 border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs text-[#CCFF00] font-mono font-bold uppercase tracking-wider rounded-full text-center">
                      <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{TESTIMONIALS_DATA[currentIndex].result}</span>
                    </div>
                  )}
                </div>
              </EmeraldSpotlightCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Informative swipe hint for touch screens - strictly single line */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 text-center mt-3 text-white/70 font-mono text-[9.5px] tracking-wider uppercase whitespace-nowrap overflow-hidden px-1">
          <span className="shrink-0 text-[#CCFF00]">←</span>
          <span className="whitespace-nowrap">Deslize para o lado para ver os depoimentos</span>
          <span className="shrink-0 text-[#CCFF00]">→</span>
        </div>
      </div>

      {/* CONTROLES DE NAVEGAÇÃO: SETAS PARA FRENTE / TRÁS E INDICADORES DE CADA UM DOS 6 CARDS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-3">
          {/* Seta Esquerda (Anterior) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Depoimento anterior (voltar)"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black border border-white/20 hover:border-[#CCFF00] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(204,255,0,0.6),0_0_35px_rgba(16,185,129,0.35)] active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicadores / Bolinhas para todos os 6 depoimentos */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
            {TESTIMONIALS_DATA.map((item, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ir para depoimento de ${item.name} (${idx + 1} de ${totalItems})`}
                  className={`rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'w-6 h-2.5 bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]'
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/70 hover:scale-125'
                  }`}
                />
              );
            })}
          </div>

          {/* Seta Direita (Próximo) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo depoimento (avançar)"
            className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black border border-white/20 hover:border-[#CCFF00] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(204,255,0,0.6),0_0_35px_rgba(16,185,129,0.35)] active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Counter readout */}
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
          Depoimento {currentIndex + 1} de {totalItems}
        </span>
      </div>
    </div>
  );
};
