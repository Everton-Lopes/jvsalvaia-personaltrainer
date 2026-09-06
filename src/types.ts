export type ServiceType = 'presencial' | 'online' | 'avaliacao';

export interface ServiceItem {
  id: ServiceType;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  ctaText: string;
  whatsappMessage: string;
  badge?: string;
  recommended?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  context: string;
  text: string;
  result?: string;
  rating: number;
}

export interface TrainingExerciseItem {
  id: string;
  title: string;
  photoUrl: string;
  fallbackPhotoUrl: string;
  instagramUrl: string;
  tag: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CampaignData {
  serviceId: ServiceType;
  heroHeadlinePrefix?: string;
  heroBadge?: string;
  heroCtaText: string;
  whatsappMessage: string;
}
