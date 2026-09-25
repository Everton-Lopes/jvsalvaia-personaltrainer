import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';
import { getStoredConsent, updateConsent } from '../utils/analytics';

interface CookieConsentProps {
  onOpenPrivacyPolicy: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onOpenPrivacyPolicy,
  onVisibilityChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        onVisibilityChange?.(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [onVisibilityChange]);

  // Listen for reset events
  useEffect(() => {
    const handleReset = () => {
      setIsVisible(true);
      onVisibilityChange?.(true);
    };
    window.addEventListener('jv_cookie_reset', handleReset);
    return () => window.removeEventListener('jv_cookie_reset', handleReset);
  }, [onVisibilityChange]);

  const handleAcceptAll = () => {
    updateConsent({ analytics: true, marketing: true });
    setIsVisible(false);
    onVisibilityChange?.(false);
  };

  const handleAcceptEssentialOnly = () => {
    updateConsent({ analytics: false, marketing: false });
    setIsVisible(false);
    onVisibilityChange?.(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Consentimento de Cookies e Privacidade"
      className="fixed bottom-3 left-3 right-3 sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-md z-50 bg-[#090909]/98 border border-white/15 hover:border-[#CCFF00]/50 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-md text-white/80 space-y-3.5 rounded-2xl"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-white/5 border border-white/15 flex items-center justify-center text-[#CCFF00] shrink-0 mt-0.5 rounded-xl">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black italic tracking-tight text-white uppercase">
            Privacidade &amp; Cookies
          </h4>
          <p className="text-xs text-white/60 leading-relaxed font-medium">
            Usamos apenas cookies essenciais para o funcionamento do site. Cookies de medição de tráfego e anúncios (Google Ads, Meta Ads) podem ser ativados com o seu consentimento, assim que as ferramentas de rastreamento forem configuradas.
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2 bg-[#CCFF00] hover:bg-white text-black font-black uppercase tracking-widest text-xs transition-colors cursor-pointer text-center rounded-full"
          >
            Aceitar Todos
          </button>
          <button
            type="button"
            onClick={handleAcceptEssentialOnly}
            className="px-4 py-2 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer text-center font-mono rounded-full"
          >
            Apenas Essenciais
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1 uppercase">
          <button
            type="button"
            onClick={onOpenPrivacyPolicy}
            className="hover:text-[#CCFF00] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Política de Privacidade
          </button>
          <span className="flex items-center gap-1 text-[10px] text-white/40">
            <ShieldCheck className="w-3 h-3 text-[#CCFF00]" />
            LGPD
          </span>
        </div>
      </div>
    </aside>
  );
};
