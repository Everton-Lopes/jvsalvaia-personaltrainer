import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDownRight } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import { ServiceType } from '../types';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface FloatingWhatsAppProps {
  currentService?: ServiceType;
  isMenuOpen?: boolean;
}

/**
 * CSS custom property that exposes the height actually occupied by the floating
 * WhatsApp UI measured from the bottom of the viewport. The footer consumes it
 * so important content is never covered, in both balloon states.
 */
export const FLOATING_WHATSAPP_CLEARANCE_VAR = '--floating-whatsapp-clearance';

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  currentService,
  isMenuOpen = false,
}) => {
  const [showBalloon, setShowBalloon] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const reshowTimerRef = useRef<number | null>(null);
  const balloonClickedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor desktop vs mobile viewport for precise 24px / 18px margin anchoring
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Balão de mensagem: primeira aparição AUTOMÁTICA após 60 segundos
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowBalloon(true);
    }, 60000);

    return () => window.clearTimeout(timer);
  }, []);

  // Limpeza do timer de reapresentação ao desmontar
  useEffect(() => {
    return () => {
      if (reshowTimerRef.current !== null) {
        window.clearTimeout(reshowTimerRef.current);
      }
    };
  }, []);

  // Expose the ACTUAL vertical space occupied by the floating UI (button plus
  // balloon, plus the bottom safe-area margin) through a CSS variable. The
  // footer consumes it, so the clearance always matches the real geometry and
  // updates automatically when the balloon opens or closes.
  useEffect(() => {
    const root = document.documentElement;
    const element = containerRef.current;

    if (!element || isMenuOpen) {
      root.style.setProperty(FLOATING_WHATSAPP_CLEARANCE_VAR, '0px');
      return;
    }

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const node = containerRef.current;
        if (!node) return;

        const bottom = Number.parseFloat(getComputedStyle(node).bottom) || 0;
        // `offsetHeight` ignores the balloon's bounce transform, so a small
        // fixed safety margin covers that animation and sub-pixel rounding.
        const occupied = node.offsetHeight + bottom + 8;
        root.style.setProperty(FLOATING_WHATSAPP_CLEARANCE_VAR, `${Math.ceil(occupied)}px`);
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [isMenuOpen]);

  // Reagenda a próxima aparição do balão (ciclo contínuo de 90s)
  const scheduleReshow = () => {
    if (balloonClickedRef.current) return;
    if (reshowTimerRef.current !== null) {
      window.clearTimeout(reshowTimerRef.current);
    }
    reshowTimerRef.current = window.setTimeout(() => {
      setShowBalloon(true);
      reshowTimerRef.current = null;
    }, 90000);
  };

  // Fechar o balão: esconde apenas o balão, mantendo o botão flutuante disponível
  // e reagendando a próxima aparição automática.
  const handleCloseBalloon = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBalloon(false);
    scheduleReshow();
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Se o clique foi no balão, encerra o ciclo de reapresentação nesta sessão.
    if ((e.currentTarget as HTMLElement)?.id === 'floating-whatsapp-balloon') {
      balloonClickedRef.current = true;
      if (reshowTimerRef.current !== null) {
        window.clearTimeout(reshowTimerRef.current);
        reshowTimerRef.current = null;
      }
    }
    openWhatsApp({
      serviceId: currentService || 'default',
      ctaLocation: 'floating_whatsapp_button',
      section: 'flutuante',
    });
  };

  // Se o menu mobile estiver aberto, oculta para evitar sobreposição visual
  if (isMenuOpen) {
    return null;
  }

  return (
    <div
      id="floating-whatsapp-container"
      ref={containerRef}
      className="fixed z-50 flex flex-col items-end pointer-events-none select-none transition-all duration-300 ease-out"
      style={{
        bottom: isDesktop
          ? 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 24px))'
          : 'max(18px, calc(env(safe-area-inset-bottom, 0px) + 18px))',
        right: isDesktop
          ? 'max(24px, calc(env(safe-area-inset-right, 0px) + 24px))'
          : 'max(18px, calc(env(safe-area-inset-right, 0px) + 18px))',
      }}
    >
      {/* BALÃO DE POP-UP DO WHATSAPP - COMPACTO, DISCRETO E COM CICLO AUTOMÁTICO */}
      <AnimatePresence>
        {showBalloon && (
          <motion.div
            key="whatsapp-popup-balloon"
            id="floating-whatsapp-balloon"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
            }}
            onClick={handleWhatsAppClick}
            className="whatsapp-balloon-bounce pointer-events-auto mb-2.5 w-auto max-w-[calc(100vw-36px)] sm:max-w-sm bg-[#0c0c0c]/98 backdrop-blur-md border border-[#CCFF00]/40 hover:border-[#CCFF00] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.85)] text-center cursor-pointer group transition-colors relative"
            role="dialog"
            aria-label="Tire dúvidas sobre treinos ou consultoria no WhatsApp"
          >
            {/* Botão de Fechar 'X' Compacto */}
            <button
              type="button"
              id="close-whatsapp-balloon"
              onClick={handleCloseBalloon}
              aria-label="Fechar mensagem do WhatsApp"
              className="touch-hit-40 absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#141414] border border-white/20 hover:border-[#CCFF00] text-white/70 hover:text-[#CCFF00] flex items-center justify-center transition-all cursor-pointer z-20 shadow-sm hover:scale-105"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Conteúdo em uma única linha compacta */}
            <div className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap pr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0 animate-pulse" />
              <p className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors leading-none tracking-tight flex items-center gap-1.5">
                <span>Olá, tire dúvidas sobre treinos ou consultoria</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" aria-hidden="true" />
              </p>
            </div>

            {/* Triângulo indicador apontando diretamente para o botão */}
            <div className="absolute -bottom-1 right-6 sm:right-7 w-2.5 h-2.5 bg-[#0c0c0c] border-r border-b border-[#CCFF00]/40 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BASE DO BOTÃO: GRADIENTE 60% #CCFF00 E 40% #10b981 COM INNER GLOW SUTIL DE 2PX */}
      <div
        id="floating-whatsapp-base-ring"
        className="pointer-events-auto relative p-1 rounded-full border border-[#CCFF00]/60 backdrop-blur-md transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(204,255,0,0.18) 0%, rgba(204,255,0,0.18) 60%, rgba(16,185,129,0.12) 100%)',
          boxShadow: 'inset 0 0 2px 1px rgba(204, 255, 0, 0.45), 0 4px 16px rgba(0, 0, 0, 0.65)',
        }}
      >
        {/* BOTÃO FLUTUANTE DO WHATSAPP (SCALE 1.05 NO HOVER COM PULSAÇÃO SUAVE) */}
        <button
          type="button"
          id="floating-whatsapp-btn"
          onClick={handleWhatsAppClick}
          className="btn-whatsapp-pulse relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#CCFF00] hover:bg-white text-black flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.65)] hover:scale-105 transition-all duration-300 cursor-pointer shrink-0 group touch-manipulation"
          aria-label="Falar com João Victor no WhatsApp"
        >
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-current group-hover:scale-105 transition-transform" />

          {/* Micro Beacon ONLINE */}
          <span className="absolute -top-1 -left-1 bg-black text-[#CCFF00] text-[8.5px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#CCFF00] shadow-sm tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            ONLINE
          </span>
        </button>
      </div>
    </div>
  );
};
