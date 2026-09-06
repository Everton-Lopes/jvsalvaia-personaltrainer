import { ServiceType } from '../types';
import { trackWhatsAppClick } from './analytics';

export const WHATSAPP_PHONE = '5511914377195';
export const WHATSAPP_PHONE_FORMATTED = '(11) 91437-7195';

export const WHATSAPP_MESSAGES: Record<ServiceType | 'default', string> = {
  presencial:
    'Olá, João Victor,\n\nVi seu site e tenho interesse no *acompanhamento presencial* em *Jundiaí* 🏋️‍♂️📍. Gostaria de saber mais sobre *horários* e *disponibilidade* para começar! 💪',
  online:
    'Olá, João Victor,\n\nVi seu site e tenho interesse na *consultoria online* 📲💪. Gostaria de entender melhor o *planejamento individualizado* e como funciona o suporte! 🚀',
  avaliacao:
    'Olá, João Victor,\n\nVi seu site e tenho interesse em agendar uma *avaliação física minuciosa* 📋🎯. Gostaria de verificar os *horários disponíveis* para agendamento! ⚖️',
  default:
    'Olá, João Victor,\n\nVi seu site e gostaria de saber mais sobre seu trabalho como *personal trainer* e *consultoria esportiva* 🏋️‍♂️🔥. Como podemos agendar para começar? 🚀',
};

export interface OpenWhatsAppOptions {
  serviceId?: ServiceType | 'default' | string;
  customMessage?: string;
  ctaLocation: string;
  section?: string;
}

/**
 * Builds the wa.me link with encoded text message
 */
export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

/**
 * Centralized trigger to track analytics and open WhatsApp conversation
 */
export function openWhatsApp({
  serviceId = 'default',
  customMessage,
  ctaLocation,
  section,
}: OpenWhatsAppOptions): string {
  const message =
    customMessage ||
    (serviceId in WHATSAPP_MESSAGES
      ? WHATSAPP_MESSAGES[serviceId as ServiceType | 'default']
      : WHATSAPP_MESSAGES.default);

  // Non-intrusive tracking (never logs private message contents)
  trackWhatsAppClick({
    ctaLocation,
    section: section || ctaLocation,
    serviceId: serviceId as string,
  });

  const url = getWhatsAppUrl(message);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
}
