import React from 'react';
import { MessageSquare, Shield, ArrowUp } from 'lucide-react';
import { TRAINER_INFO } from '../data/trainerData';
import { openWhatsApp, WHATSAPP_PHONE_FORMATTED } from '../utils/whatsapp';
import { JVLogo } from './JVLogo';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyPolicy }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505]/85 backdrop-blur-md border-t border-white/10 text-white/60 text-xs sm:text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <JVLogo size="md" />
            <div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase block">
                JV Salvaia Personal Trainer
              </span>
              <span className="text-[10px] text-[#CCFF00] font-mono uppercase tracking-widest block mt-0.5">
                CREF {TRAINER_INFO.cref} • {TRAINER_INFO.city}
              </span>
            </div>
          </div>

          {/* Quick WhatsApp Link */}
          <button
            type="button"
            onClick={() =>
              openWhatsApp({
                serviceId: 'default',
                ctaLocation: 'footer_whatsapp',
                section: 'rodape',
              })
            }
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black font-black uppercase tracking-widest text-xs px-5 py-2.5 border border-white/15 hover:border-[#CCFF00] transition-colors cursor-pointer rounded-full"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>WhatsApp: {WHATSAPP_PHONE_FORMATTED}</span>
          </button>
        </div>

        {/* Back to top & LGPD Policy */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider">
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>Política de Privacidade e Cookies (LGPD)</span>
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#CCFF00] font-bold transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs font-mono text-white/40 uppercase tracking-wider">
          <p>
            © {new Date().getFullYear()} JV Salvaia Personal Trainer • Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
