import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/trainerData';
import { openWhatsApp } from '../utils/whatsapp';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-transparent border-b border-white/10 relative overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(204,255,0,0.06)_0%,transparent_65%)]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block px-4 py-1.5 border border-[#CCFF00] text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#CCFF00]/10 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(204,255,0,0.15)]">
            05 // TIRE SUAS DÚVIDAS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-white uppercase leading-none text-enhance-heading">
            AINDA TEM <span className="text-[#CCFF00]">DÚVIDAS?</span>
          </h2>
          <div className="w-14 h-[3px] bg-gradient-to-r from-emerald-400 via-[#CCFF00] to-emerald-400 mx-auto shadow-[0_0_10px_#CCFF00] rounded-full" />
          <p className="text-base sm:text-lg text-white/85 font-medium max-w-2xl mx-auto leading-relaxed text-enhance-subheading">
            Respostas objetivas para você tomar sua decisão e começar seu acompanhamento com segurança.
          </p>
        </div>

        {/* 5 Questions Accordion */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            const numPrefix = `0${idx + 1}/`;

            return (
              <div
                key={idx}
                className={`border transition-all duration-300 overflow-hidden rounded-2xl ${
                  isOpen
                    ? 'bg-[#090909] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3),0_0_15px_rgba(204,255,0,0.2)]'
                    : 'bg-[#070707] border-white/10 hover:border-[#CCFF00]/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.25),0_0_15px_rgba(204,255,0,0.18)]'
                }`}
              >
                <button
                  type="button"
                  id={`faq-toggle-${idx}`}
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#CCFF00] font-bold">
                      {numPrefix}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-black italic uppercase tracking-tight transition-colors ${
                        isOpen ? 'text-[#CCFF00]' : 'text-white hover:text-white/90'
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={`w-7 h-7 border flex items-center justify-center shrink-0 transition-transform duration-200 rounded-full ${
                      isOpen
                        ? 'bg-[#CCFF00] border-[#CCFF00] text-black rotate-180'
                        : 'bg-white/5 border-white/15 text-[#CCFF00]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-white/80 leading-relaxed border-t border-white/10 pt-4 font-medium">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Mini WhatsApp Helper */}
        <div className="mt-12 text-center bg-[#090909]/90 backdrop-blur-md border border-emerald-500/30 p-6 sm:p-8 space-y-4 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.1)]">
          <h3 className="text-2xl sm:text-3xl text-white uppercase font-black italic tracking-tight text-enhance-heading">
            FICOU COM OUTRA PERGUNTA?
          </h3>
          <p className="text-xs sm:text-sm text-white/75 max-w-md mx-auto font-medium text-enhance-subheading">
            Fale direto com João Victor no WhatsApp. Ele mesmo responde para tirar qualquer dúvida sobre vagas e horários.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              id="faq-whatsapp-btn"
              onClick={() =>
                openWhatsApp({
                  serviceId: 'default',
                  ctaLocation: 'faq_bottom_box',
                  section: 'faq',
                })
              }
              className="inline-flex items-center justify-center text-center gap-2 bg-[#CCFF00] hover:bg-white text-black font-black uppercase tracking-widest text-xs px-6 py-3.5 transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3),0_0_25px_rgba(16,185,129,0.2)] cursor-pointer rounded-full"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Falar no WhatsApp Agora</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
