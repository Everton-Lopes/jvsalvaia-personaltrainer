import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Laptop, Activity, Check, MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '../data/trainerData';
import { openWhatsApp } from '../utils/whatsapp';
import { ServiceType } from '../types';
import { EmeraldSpotlightCard } from './EmeraldSpotlightCard';

interface ServicesProps {
  currentService?: ServiceType;
}

export const Services: React.FC<ServicesProps> = ({ currentService }) => {
  const getIcon = (id: ServiceType) => {
    switch (id) {
      case 'presencial':
        return <Dumbbell className="w-6 h-6 text-[#CCFF00]" />;
      case 'online':
        return <Laptop className="w-6 h-6 text-[#CCFF00]" />;
      case 'avaliacao':
        return <Activity className="w-6 h-6 text-[#CCFF00]" />;
    }
  };

  const handleSelectService = (id: ServiceType) => {
    openWhatsApp({
      serviceId: id,
      ctaLocation: 'service_card_button',
      section: 'servicos',
    });
  };

  return (
    <section id="servicos" className="py-24 bg-transparent border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-block px-4 py-1.5 border border-[#CCFF00] text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#CCFF00]/10 backdrop-blur-md rounded-full">
            02 // MODALIDADES DE ATENDIMENTO
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-white uppercase leading-none text-enhance-heading">
            ESCOLHA COMO <span className="text-[#CCFF00]">QUER TREINAR</span>
          </h2>
          <div className="w-14 h-[3px] bg-[#CCFF00] mx-auto shadow-[0_0_4px_#CCFF00] rounded-full" />
          <p className="text-base sm:text-lg text-white/85 font-medium max-w-2xl mx-auto leading-relaxed text-enhance-subheading">
            Seja presencial em Jundiaí ou online em qualquer lugar: você terá a mesma precisão técnica, periodização e foco inegociável em resultados.
          </p>
        </motion.div>

        {/* 3 Services Cards Grid com Iluminação Esmeralda & Cursor Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SERVICES_DATA.map((service, index) => {
            const isHighlighted = currentService === service.id || (!currentService && service.recommended);
            const numPrefix = `0${index + 1}/`;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <EmeraldSpotlightCard
                  emeraldIntensity={isHighlighted ? 'high' : 'standard'}
                  className={`p-7 lg:p-8 flex flex-col justify-between transition-all duration-300 relative h-full ${
                    isHighlighted
                      ? 'border-2 border-[#CCFF00] shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_12px_rgba(204,255,0,0.15)]'
                      : 'border border-white/10 hover:border-transparent shadow-xl'
                  }`}
                >
                  {/* Highlighted Badge animado pulsando no meio da linha superior do card */}
                  {isHighlighted && (
                    <motion.div
                      initial={{ x: '-50%', y: '-50%' }}
                      animate={{
                        x: '-50%',
                        y: '-50%',
                        scale: [1, 1.04, 1],
                        boxShadow: [
                          '0 2px 8px rgba(0,0,0,0.9), 0 0 6px rgba(204,255,0,0.4)',
                          '0 2px 10px rgba(0,0,0,0.9), 0 0 12px rgba(204,255,0,0.6)',
                          '0 2px 8px rgba(0,0,0,0.9), 0 0 6px rgba(204,255,0,0.4)',
                        ],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute top-0 left-1/2 bg-[#CCFF00] text-black font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-4 py-1.5 z-30 whitespace-nowrap flex items-center justify-center gap-1.5 rounded-full border border-black/30 cursor-default select-none"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse" />
                      <span>MAIS PROCURADO</span>
                    </motion.div>
                  )}

                  <div>
                    {/* Card Header Centralizado */}
                    <div className="flex flex-col items-center justify-center gap-2 mb-5 text-center">
                      <div className="p-3 bg-black/70 border border-emerald-500/30 text-[#CCFF00] rounded-xl shadow-inner">
                        {getIcon(service.id)}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#CCFF00] tracking-widest text-center">
                        {numPrefix} PLANO
                      </span>
                    </div>

                    {/* Title & Subtitle Centralizados */}
                    <h3 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase mb-2 group-hover:text-[#CCFF00] transition-colors text-center">
                      {service.title}
                    </h3>
                    <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase mb-4 font-semibold text-center">
                      {service.subtitle}
                    </div>

                    {/* Description Centralizada */}
                    <p className="text-sm text-white/80 leading-relaxed mb-6 font-medium text-center">
                      {service.description}
                    </p>

                    {/* Highlights List Centralizada */}
                    <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                      {service.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center justify-center gap-2.5 text-xs text-white/85 font-medium text-center">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#CCFF00]" />
                          </div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectService(service.id)}
                    className={`w-full py-4 px-5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer rounded-full mt-auto ${
                      isHighlighted
                        ? 'bg-[#CCFF00] hover:bg-white text-black shadow-[0_0_20px_rgba(204,255,0,0.35),0_0_25px_rgba(16,185,129,0.25)]'
                        : 'bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black border border-white/15 hover:border-[#CCFF00]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>CONSULTAR NO WHATSAPP</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </EmeraldSpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
