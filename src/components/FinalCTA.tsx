import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';
import { TRAINER_INFO } from '../data/trainerData';
import { openWhatsApp } from '../utils/whatsapp';
import { ServiceType } from '../types';

interface FinalCTAProps {
  currentService?: ServiceType;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ currentService }) => {
  return (
    <section
      id="contato"
      className="py-28 bg-transparent relative overflow-hidden text-center border-t border-white/10 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <span className="inline-block px-4 py-1.5 border border-[#CCFF00] text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#CCFF00]/10 backdrop-blur-md rounded-full shadow-[0_0_8px_rgba(204,255,0,0.12)]">
            06 // VAGAS &amp; ATENDIMENTO DIRETO
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[88px] font-black italic tracking-tighter text-white uppercase leading-[0.88] text-enhance-heading">
            VAMOS TIRAR SEU OBJETIVO <br />
            <span className="text-[#CCFF00]">
              DO PAPEL?
            </span>
          </h2>
          <div className="w-16 h-[3px] bg-[#CCFF00] mx-auto shadow-[0_0_8px_#CCFF00] rounded-full" />
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium text-enhance-subheading">
            {TRAINER_INFO.finalCtaSubheadline}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="pt-2 flex flex-col items-center gap-3"
        >
          <button
            type="button"
            id="final-cta-btn"
            onClick={() =>
              openWhatsApp({
                serviceId: currentService || 'default',
                ctaLocation: 'final_cta_section',
                section: 'final_cta',
              })
            }
            className="btn-whatsapp-pulse w-full sm:w-auto inline-flex items-center justify-center text-center gap-3 bg-[#CCFF00] hover:bg-white text-black font-black uppercase tracking-widest text-sm sm:text-base px-8 sm:px-12 py-5 transition-all duration-300 shadow-[0_0_35px_rgba(204,255,0,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] cursor-pointer transform hover:-translate-y-0.5 rounded-full"
          >
            <MessageSquare className="w-5 h-5 fill-current shrink-0" />
            <span>FALAR COM JOÃO VICTOR NO WHATSAPP</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <span className="text-xs font-mono text-white/60 uppercase tracking-widest flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] inline-block animate-pulse" />
            ATENDIMENTO DIRETO PELO PERSONAL
          </span>
        </motion.div>

        {/* Reassurances row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/70 font-mono uppercase tracking-wider"
        >
          <div className="flex items-center gap-1.5 border border-white/15 hover:border-[#CCFF00]/70 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full hover:shadow-[0_0_20px_rgba(204,255,0,0.35),0_0_15px_rgba(16,185,129,0.25)] hover:text-white transition-all cursor-pointer">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>CREF {TRAINER_INFO.cref}</span>
          </div>
          <div className="flex items-center gap-1.5 border border-white/15 hover:border-[#CCFF00]/70 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full hover:shadow-[0_0_20px_rgba(204,255,0,0.35),0_0_15px_rgba(16,185,129,0.25)] hover:text-white transition-all cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>{TRAINER_INFO.city}</span>
          </div>
          <div className="flex items-center gap-1.5 border border-white/15 hover:border-[#CCFF00]/70 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full hover:shadow-[0_0_20px_rgba(204,255,0,0.35),0_0_15px_rgba(16,185,129,0.25)] hover:text-white transition-all cursor-pointer">
            <Award className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>{TRAINER_INFO.experience}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
