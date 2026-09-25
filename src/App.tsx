/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LandingHeader } from './components/LandingHeader';
import { FixedGymBackground } from './components/FixedGymBackground';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { SocialAndTrainingSection } from './components/SocialAndTrainingSection';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { StructuredData } from './components/StructuredData';
import { initAnalytics } from './utils/analytics';
import { ServiceType } from './types';

export default function App() {
  const [currentService, setCurrentService] = useState<ServiceType | undefined>(undefined);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Initialise analytics and UTMs under LGPD consent constraints
    initAnalytics();

    // 2. Parse campaign parameters (?servico=presencial | online | avaliacao)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const servicoParam = searchParams.get('servico')?.toLowerCase();
      if (
        servicoParam === 'presencial' ||
        servicoParam === 'online' ||
        servicoParam === 'avaliacao'
      ) {
        setCurrentService(servicoParam as ServiceType);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#CCFF00] selection:text-black">
      {/* SEO structured data (only injected when Google IDs are configured) */}
      <StructuredData />

      {/* 
        STATIC FIXED PHOTOGRAPHIC GYM BACKGROUND
        Remains completely motionless during scroll while all page content passes over it.
        Includes images of people training across all sections from start to finish.
      */}
      <FixedGymBackground />

      {/* Top Fixed Header with Mobile/Tablet Hamburger & Desktop Centered Nav */}
      <LandingHeader
        currentService={currentService}
        onMenuStateChange={setIsMenuOpen}
      />

      <main className="relative z-10 overflow-x-clip">
        {/* 01 — HERO (Personal Trainer coaching atmosphere) */}
        <Hero currentService={currentService} />

        {/* 02 — SERVIÇOS (High-end gym training modalities) */}
        <Services currentService={currentService} />

        {/* 03 — PROVA SOCIAL + TREINOS NA PRÁTICA (Genuine exercise execution cards) */}
        <SocialAndTrainingSection />

        {/* 04 — FAQ (Frequently Asked Questions) */}
        <FAQ />

        {/* FINAL CLOSING CTA */}
        <FinalCTA currentService={currentService} />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)} />
      </div>

      {/* Desktop Floating WhatsApp Button (Hidden when menu is open) */}
      <FloatingWhatsApp
        currentService={currentService}
        isMenuOpen={isMenuOpen}
      />

      {/* LGPD Cookie Consent Banner */}
      <CookieConsent
        onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
      />

      {/* LGPD Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />
    </div>
  );
}
