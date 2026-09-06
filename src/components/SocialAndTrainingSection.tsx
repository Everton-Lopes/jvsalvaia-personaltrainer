import React from 'react';
import { SocialProof } from './SocialProof';
import { TrainingGallery } from './TrainingGallery';

export const SocialAndTrainingSection: React.FC = () => {
  return (
    <section className="py-24 bg-transparent border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        {/* Part 1: Treinos na Prática (The 4 Genuine Exercise Cards of João Victor) */}
        <TrainingGallery />

        {/* Part 2: Social Proof (Depoimentos Reais) */}
        <SocialProof />
      </div>
    </section>
  );
};
