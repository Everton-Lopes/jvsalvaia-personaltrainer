import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Dumbbell, Zap, CheckCircle2, ChevronDown } from 'lucide-react';
import { TRAINER_INFO } from '../data/trainerData';
import { openWhatsApp } from '../utils/whatsapp';
import { scrollToAnchor } from '../utils/headerOffset';
import { ServiceType } from '../types';
import { EmeraldSpotlightCard } from './EmeraldSpotlightCard';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface HeroProps {
  currentService?: ServiceType;
}

export const Hero: React.FC<HeroProps> = ({ currentService }) => {
  // Dynamic campaign text mapping
  const campaignConfigs: Record<
    ServiceType,
    { badge: string; headlineSub: string; ctaText: string }
  > = {
    online: {
      badge: 'CONSULTORIA ONLINE INDIVIDUALIZADA',
      headlineSub:
        'Planejamento individualizado e suporte direto para você treinar com máxima técnica e orientação onde estiver.',
      ctaText: 'QUERO COMEÇAR ONLINE',
    },
    presencial: {
      badge: 'PERSONAL TRAINER PRESENCIAL EM JUNDIAÍ',
      headlineSub:
        'Acompanhamento lado a lado com correção biomecânica e progressão de cargas nas academias e condomínios de Jundiaí e região.',
      ctaText: 'QUERO TREINAR PRESENCIALMENTE',
    },
    avaliacao: {
      badge: 'AVALIAÇÃO FÍSICA MINUCIOSA',
      headlineSub:
        'Mapeamento completo de composição corporal, postura e encurtamentos para traçar o caminho exato da sua evolução.',
      ctaText: 'QUERO AGENDAR AVALIAÇÃO',
    },
  };

  const activeCampaign = currentService ? campaignConfigs[currentService] : null;

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsApp({
      serviceId: currentService || 'default',
      ctaLocation: 'hero_main_button',
      section: 'hero',
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-transparent border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Professional Credentials Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-[#CCFF00] text-[#CCFF00] text-[11px] font-mono font-bold uppercase tracking-widest bg-[#CCFF00]/10 backdrop-blur-md transition-all rounded-full cursor-pointer">
              <Zap className="w-3.5 h-3.5" />
              {activeCampaign ? activeCampaign.badge : 'JV SALVAIA • PERSONAL & CONSULTORIA'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-white/20 text-white/80 text-[11px] font-mono font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md hover:border-[#CCFF00]/70 hover:text-white transition-all rounded-full cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
              CREF {TRAINER_INFO.cref}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-white/20 text-white/80 text-[11px] font-mono font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md hover:border-[#CCFF00]/70 hover:text-white transition-all rounded-full cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
              {TRAINER_INFO.city}
            </span>
          </motion.div>

          {/* Headline - High Contrast Bold Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-black italic tracking-tighter text-white leading-[0.88] uppercase text-enhance-heading">
              FAÇO DO SEU OBJETIVO <br />
              <span className="text-[#CCFF00]">
                A MINHA META.
              </span>
            </h1>
            <div className="w-20 h-[3px] bg-[#CCFF00] mx-auto shadow-[0_0_6px_#CCFF00] rounded-full" />
          </motion.div>

          {/* Subheadline with clear value proposition */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium text-enhance-subheading"
          >
            {activeCampaign
              ? activeCampaign.headlineSub
              : TRAINER_INFO.subheadline}
          </motion.p>

          {/* Direct WhatsApp CTA Button & Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="pt-2 flex flex-col items-center gap-3 w-full sm:w-auto"
          >
            <button
              type="button"
              id="hero-main-cta"
              onClick={handleCtaClick}
              className="btn-whatsapp-pulse w-full sm:w-auto inline-flex items-center justify-center text-center gap-3 bg-[#CCFF00] hover:bg-white text-black font-black uppercase tracking-widest text-sm sm:text-base px-8 sm:px-12 py-5 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transform hover:-translate-y-0.5 rounded-full"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
              <span className="text-center tracking-wider">
                {activeCampaign ? activeCampaign.ctaText : 'FALAR COM JOÃO VICTOR'}
              </span>
            </button>

            {/* Badge RESPOSTA DIRETA PELO WHATSAPP */}
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] whitespace-nowrap pt-1">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_4px_#CCFF00] shrink-0 animate-ping" />
              <span>{TRAINER_INFO.whatsappBadge}</span>
            </div>
          </motion.div>

          {/* Tactical Features Strip - Emerald Spotlight Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl pt-6"
          >
            <EmeraldSpotlightCard
              className="p-4 text-center border border-white/10 hover:border-emerald-500/50 shadow-lg"
              contentClassName="items-center text-center justify-center gap-1.5"
              emeraldIntensity="high"
            >
              <span className="text-[10px] text-[#CCFF00] font-mono tracking-widest uppercase mb-1 block w-full text-center">
                01 / PRESCRIÇÃO
              </span>
              <div className="flex items-center justify-center gap-2 text-center w-full">
                <Dumbbell className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-black text-white uppercase tracking-tight text-center">
                  Biomecânica &amp; Carga
                </span>
              </div>
            </EmeraldSpotlightCard>

            <EmeraldSpotlightCard
              className="p-4 text-center border border-white/10 hover:border-emerald-500/50 shadow-lg"
              contentClassName="items-center text-center justify-center gap-1.5"
              emeraldIntensity="high"
            >
              <span className="text-[10px] text-[#CCFF00] font-mono tracking-widest uppercase mb-1 block w-full text-center">
                02 / ACOMPANHAMENTO
              </span>
              <div className="flex items-center justify-center gap-2 text-center w-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-black text-white uppercase tracking-tight text-center">
                  Presencial &amp; Online
                </span>
              </div>
            </EmeraldSpotlightCard>

            <EmeraldSpotlightCard
              className="p-4 text-center border border-white/10 hover:border-emerald-500/50 shadow-lg"
              contentClassName="items-center text-center justify-center gap-1.5"
              emeraldIntensity="high"
            >
              <span className="text-[10px] text-[#CCFF00] font-mono tracking-widest uppercase mb-1 block w-full text-center">
                03 / ATENDIMENTO
              </span>
              <div className="flex items-center justify-center gap-2 text-center w-full">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-black text-white uppercase tracking-tight text-center">
                  Jundiaí e Região
                </span>
              </div>
            </EmeraldSpotlightCard>
          </motion.div>
        </div>
      </div>

      {/* Immersive Scroll Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative z-10 mt-12 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#CCFF00] transition-colors"
      >
        <a
          href="#servicos"
          onClick={(e) => {
            e.preventDefault();
            scrollToAnchor('servicos', { behavior: 'smooth' });
          }}
          aria-label="Rolar para os serviços"
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/50 group-hover:text-[#CCFF00] transition-colors">
            Role para explorar
          </span>
          <ChevronDown className="w-4 h-4 text-[#CCFF00] animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};
