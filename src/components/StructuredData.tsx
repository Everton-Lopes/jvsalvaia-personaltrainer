import React, { useEffect } from 'react';
import { TRAINER_INFO } from '../data/trainerData';
import { WHATSAPP_PHONE } from '../utils/whatsapp';

/**
 * Injects a LocalBusiness JSON-LD block into <head> only when a Google Place ID
 * and/or Google Business Profile ID is configured. It uses only real facts
 * already present in the codebase — no invented address, hours, prices or ratings.
 * When neither ID is present, nothing is rendered or injected.
 */
export const StructuredData: React.FC = () => {
  useEffect(() => {
    const env = (import.meta as any).env || {};
    const placeId: string | undefined = env.VITE_GOOGLE_PLACE_ID;
    const businessProfileId: string | undefined = env.VITE_GOOGLE_BUSINESS_PROFILE_ID;

    if (!placeId && !businessProfileId) return;

    const sameAs: string[] = [];
    if (placeId) {
      sameAs.push(`https://www.google.com/maps/place/?q=place_id:${placeId}`);
    }
    if (businessProfileId) {
      sameAs.push(`https://www.google.com/maps?cid=${businessProfileId}`);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: TRAINER_INFO.name,
      description: TRAINER_INFO.subheadline,
      url: 'https://jvsalvaiapersonal.netlify.app/',
      image: 'https://jvsalvaiapersonal.netlify.app/og-image.jpg',
      telephone: `+${WHATSAPP_PHONE}`,
      areaServed: TRAINER_INFO.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jundiaí',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      sameAs,
    };

    const scriptId = 'local-business-jsonld';
    document.getElementById(scriptId)?.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
};
