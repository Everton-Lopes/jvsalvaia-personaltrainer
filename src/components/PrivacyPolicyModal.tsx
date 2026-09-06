import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, RefreshCw, CheckCircle } from 'lucide-react';
import { TRAINER_INFO } from '../data/trainerData';
import { resetConsent } from '../utils/analytics';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const handleResetCookies = () => {
    resetConsent();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#090909] border border-white/20 shadow-2xl flex flex-col z-10 overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 border border-white/15 flex items-center justify-center text-[#CCFF00] rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black italic tracking-tight text-white uppercase">
                    POLÍTICA DE PRIVACIDADE &amp; LGPD
                  </h3>
                  <p className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-widest mt-0.5">
                    {TRAINER_INFO.brand} • CREF {TRAINER_INFO.cref}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 rounded-full"
                aria-label="Fechar Política de Privacidade"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              <div className="bg-[#0e1008] border border-[#CCFF00]/40 p-4 flex items-start gap-3 text-xs text-white/80 rounded-xl">
                <Lock className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                <div>
                  Esta Política descreve de forma transparente como <strong>{TRAINER_INFO.name}</strong> (CREF {TRAINER_INFO.cref}) trata informações em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[#CCFF00]">01 /</span> CONTROLADOR DOS DADOS
                </h4>
                <p className="text-white/60 text-xs">
                  O responsável pelo tratamento de dados é <strong>{TRAINER_INFO.name}</strong>, profissional de Educação Física devidamente registrado sob o <strong>CREF {TRAINER_INFO.cref}</strong>, atuando em Jundiaí - SP e consultoria online.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[#CCFF00]">02 /</span> DADOS COLETADOS &amp; FINALIDADE
                </h4>
                <p className="text-white/60 text-xs">
                  - <strong>Dados de Navegação:</strong> Informações agregadas de visitação e parâmetros de campanha (UTM, fbclid, gclid) para mensuração de tráfego via Meta Ads e Google Ads.<br />
                  - <strong>Conversa no WhatsApp:</strong> Dados fornecidos voluntariamente durante a conversa para montagem de orçamento e alinhamento de horários.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[#CCFF00]">03 /</span> DIREITOS DO TITULAR
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80 pt-1">
                  <div className="bg-white/5 p-2.5 border border-white/10 flex items-center gap-2 font-mono text-[11px] uppercase">
                    <CheckCircle className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                    <span>Acesso aos dados</span>
                  </div>
                  <div className="bg-white/5 p-2.5 border border-white/10 flex items-center gap-2 font-mono text-[11px] uppercase">
                    <CheckCircle className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                    <span>Correção e exclusão</span>
                  </div>
                  <div className="bg-white/5 p-2.5 border border-white/10 flex items-center gap-2 font-mono text-[11px] uppercase">
                    <CheckCircle className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                    <span>Revogação de consentimento</span>
                  </div>
                  <div className="bg-white/5 p-2.5 border border-white/10 flex items-center gap-2 font-mono text-[11px] uppercase">
                    <CheckCircle className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                    <span>Transparência total</span>
                  </div>
                </div>
              </div>

              {/* Cookie Reset */}
              <div className="bg-[#050505] border border-white/10 p-4 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#CCFF00]" />
                  GERENCIAR PREFERÊNCIAS DE COOKIES
                </h4>
                <p className="text-xs text-white/50">
                  Você pode redefinir ou revogar a autorização de cookies analíticos e de marketing a qualquer instante.
                </p>
                <button
                  type="button"
                  id="reset-cookies-btn"
                  onClick={handleResetCookies}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest bg-white/5 hover:bg-[#CCFF00] text-white hover:text-black border border-white/15 hover:border-[#CCFF00] transition-colors cursor-pointer rounded-full"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Redefinir Preferências de Cookies
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0d0d0d] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#CCFF00] hover:bg-white text-black font-black uppercase tracking-widest text-xs transition-colors cursor-pointer rounded-full"
              >
                Entendi e Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
