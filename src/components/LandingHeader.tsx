import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, MapPin, Menu, X, ChevronRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JVLogo } from './JVLogo';
import { TRAINER_INFO } from '../data/trainerData';
import { openWhatsApp } from '../utils/whatsapp';
import { ServiceType } from '../types';

interface LandingHeaderProps {
  currentService?: ServiceType;
  onMenuStateChange?: (isOpen: boolean) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  currentService,
  onMenuStateChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Notify parent component about menu open/close state
  useEffect(() => {
    onMenuStateChange?.(isMenuOpen);
  }, [isMenuOpen, onMenuStateChange]);

  // Monitor scroll for fixed header styling and progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile/tablet menu is open, restore when closed
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  const handleHeaderCta = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    openWhatsApp({
      serviceId: currentService || 'default',
      ctaLocation: 'header_navbar',
      section: 'topo',
    });
  };

  const navLinks = [
    { label: 'Início', href: '#hero', num: '01' },
    { label: 'Modalidades', href: '#servicos', num: '02' },
    { label: 'Treinos', href: '#treinos', num: '03' },
    { label: 'Resultados', href: '#prova-social', num: '04' },
    { label: 'Dúvidas', href: '#faq', num: '05' },
    { label: 'Contato', href: '#contato', num: '06' },
  ];

  // Smooth navigation that reliably scrolls to the target section across all devices
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const targetId = href.replace('#', '');

    const scrollToTarget = () => {
      // Guarantee scroll lock is removed before calculating positions and scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      const target = document.getElementById(targetId) || document.querySelector(href);
      if (target) {
        const headerEl = document.getElementById('main-header');
        const headerHeight = headerEl ? Math.min(headerEl.offsetHeight, 76) : 72;

        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - headerHeight - 12;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });

        // Update browser URL hash
        try {
          window.history.pushState(null, '', href);
        } catch {
          // Fallback
        }
      }
    };

    if (isMenuOpen) {
      // Mobile / Tablet: immediately unlock scroll and close menu, then scroll smoothly once viewport unfreezes
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setIsMenuOpen(false);
      setTimeout(scrollToTarget, 120);
    } else {
      // Desktop: immediate smooth scroll
      scrollToTarget();
    }
  };

  return (
    <>
      {/* FIXED HEADER FOR ALL SCREENS (MOBILE VERTICAL/HORIZONTAL, TABLET VERTICAL/HORIZONTAL, DESKTOP) */}
      <header
        id="main-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-[background-color,border-color,box-shadow,padding] duration-200 ${
          isScrolled || isMenuOpen
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-2.5 sm:py-3'
            : 'bg-[#050505]/85 backdrop-blur-sm border-b border-white/5 py-3 sm:py-4'
        }`}
      >
        {/* Dynamic Scroll Progress Bar */}
        <div
          className="absolute top-0 left-0 h-[2.5px] bg-[#CCFF00] shadow-[0_0_4px_#CCFF00] transition-all duration-75 z-50 pointer-events-none"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-4 pr-5 sm:px-6 sm:pr-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 relative">
          {/* Brand Identity (Left Wing) */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 z-10"
            aria-label="João Victor Salvaia - Voltar ao início"
          >
            <JVLogo size="md" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tighter italic text-white leading-none group-hover:text-[#CCFF00] transition-colors">
                JV SALVAIA
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#CCFF00] font-mono tracking-widest uppercase font-bold">
                  CREF {TRAINER_INFO.cref}
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
                <span className="hidden sm:inline-block text-[10px] text-white/50 font-mono tracking-wider uppercase">
                  {TRAINER_INFO.city}
                </span>
              </div>
            </div>
          </a>

          {/* Menu Suspenso Desktop (Centralizado): visível EXCLUSIVAMENTE em Desktop (xl: 1280px+) */}
          {/* Todas as telas mobile e tablet utilizam exclusivamente o menu hambúrguer */}
          <nav
            id="desktop-navigation"
            aria-label="Menu suspenso com seções centralizadas"
            className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center justify-center bg-[#090909]/90 backdrop-blur-md border border-white/15 hover:border-[#CCFF00]/40 px-2.5 py-1 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all duration-300 z-10"
          >
            <ul className="flex items-center gap-0.5 list-none m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/75 hover:text-[#CCFF00] hover:bg-white/[0.06] rounded-full transition-all duration-200 cursor-pointer relative group leading-none"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200 rounded-full shadow-[0_0_4px_#CCFF00]" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions Column (Right Wing): WhatsApp Button + Hamburger (mobile, tablet portrait, tablet landscape: < xl) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-10 mr-0.5 sm:mr-0">
            {/* Direct WhatsApp CTA Button */}
            <button
              type="button"
              id="header-whatsapp-cta"
              onClick={handleHeaderCta}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#CCFF00] hover:bg-white text-black font-black text-[11px] sm:text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 uppercase tracking-wider sm:tracking-widest transition-all duration-300 cursor-pointer shrink-0 shadow-sm hover:shadow-[0_0_10px_rgba(204,255,0,0.25)] rounded-full"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="hidden sm:inline">Chamar no WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {/* Mobile & Tablet Hamburger Toggle Button (Active on < xl: covers mobile portrait, mobile landscape, tablet portrait, tablet landscape) */}
            <button
              type="button"
              id="hamburger-menu-toggle"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-tablet-menu-dropdown"
              className="xl:hidden w-10 h-10 text-white hover:text-[#CCFF00] bg-white/5 hover:bg-white/10 border border-white/15 transition-colors cursor-pointer flex items-center justify-center shrink-0 rounded-full"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-[#CCFF00]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 
          DOWNWARD OPENING ACCORDION DROPDOWN FOR MOBILE & TABLET (< xl)
          Opens directly downwards from the header, WITHOUT duplicating the logo/header!
        */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-tablet-menu-dropdown"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação mobile e tablet"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden w-full overflow-hidden border-t border-white/10 bg-[#090909]/98 backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.95)] mt-3 rounded-b-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 sm:py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                <div className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase mb-3">
                  // NAVEGAÇÃO PRINCIPAL
                </div>

                {/* Nav Links Grid: 1 col on mobile, 2 cols on tablet for optimal space usage */}
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" aria-label="Links do menu">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="group flex items-center justify-between p-4 border border-white/10 hover:border-[#CCFF00]/50 bg-white/[0.04] hover:bg-[#CCFF00]/10 active:bg-[#CCFF00]/20 transition-all text-white/90 hover:text-[#CCFF00] cursor-pointer rounded-xl touch-manipulation select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#CCFF00] font-bold">
                          {link.num}
                        </span>
                        <span className="text-sm font-black uppercase tracking-wider italic text-white group-hover:text-[#CCFF00] transition-colors">
                          {link.label === 'Treinos' ? 'Treinos na Prática' : link.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#CCFF00] group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </nav>

                {/* Direct Action Inside Dropdown */}
                <div className="pt-5 mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleHeaderCta}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#CCFF00] hover:bg-white text-black font-black text-xs py-3.5 px-6 uppercase tracking-widest transition-colors cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.3)] rounded-full"
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>Falar com João Victor no WhatsApp</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-white/60 uppercase">
                    <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>{TRAINER_INFO.city} • Presencial &amp; Online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* VÉU EMBAÇADO (BLURRED VEIL OVERLAY) ATRÁS DO MENU QUANDO ABERTO */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="menu-backdrop-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 xl:hidden cursor-pointer"
            aria-label="Fechar menu de navegação"
          />
        )}
      </AnimatePresence>
    </>
  );
};
