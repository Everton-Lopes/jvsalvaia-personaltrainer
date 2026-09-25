import React, { useState, useEffect, useRef } from 'react';

interface BackgroundScene {
  id: string;
  src: string;        // Fallback JPG
  webp: string;       // High-res WebP for desktop & retina
  mobileWebp: string; // Compact WebP optimized for mobile connections
  alt: string;
}

const BACKGROUND_SCENES: BackgroundScene[] = [
  {
    id: 'hero',
    src: '/backgrounds/bg-hero-gym-ai.jpg',
    webp: '/backgrounds/bg-hero-gym-ai.webp',
    mobileWebp: '/backgrounds/bg-hero-gym-ai-mobile.webp',
    alt: 'Personal trainer orientando treino de musculação na academia',
  },
  {
    id: 'servicos',
    src: '/backgrounds/bg-strength-gym-ai.jpg',
    webp: '/backgrounds/bg-strength-gym-ai.webp',
    mobileWebp: '/backgrounds/bg-strength-gym-ai-mobile.webp',
    alt: 'Treinamento de força e musculação com acompanhamento profissional',
  },
  {
    id: 'treinos',
    src: '/backgrounds/bg-training-coaching.jpg',
    webp: '/backgrounds/bg-training-coaching.webp',
    mobileWebp: '/backgrounds/bg-training-coaching-mobile.webp',
    alt: 'Execução biomecânica e consultoria com personal trainer',
  },
  {
    id: 'prova-social',
    src: '/backgrounds/bg-services-gym.jpg',
    webp: '/backgrounds/bg-services-gym.webp',
    mobileWebp: '/backgrounds/bg-services-gym-mobile.webp',
    alt: 'Ambiente fitness premium e musculação de alta performance',
  },
  {
    id: 'faq-contato',
    src: '/backgrounds/bg-cta-workout.jpg',
    webp: '/backgrounds/bg-cta-workout.webp',
    mobileWebp: '/backgrounds/bg-cta-workout-mobile.webp',
    alt: 'Atleta em treino focado de musculação e hipertrofia',
  },
];

export const FixedGymBackground: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  // Lazy-loading: only index 0 (Hero) is initially mounted, others are loaded on demand or idle
  const [loadedSceneIndices, setLoadedSceneIndices] = useState<Set<number>>(() => new Set([0]));
  const idleTimerRef = useRef<number | null>(null);

  // Progressive hydration: load scenes when active or adjacent
  const markSceneAsLoaded = (index: number) => {
    setLoadedSceneIndices((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  useEffect(() => {
    // Always mark current and next scene as loaded
    markSceneAsLoaded(activeSceneIndex);
    if (activeSceneIndex + 1 < BACKGROUND_SCENES.length) {
      markSceneAsLoaded(activeSceneIndex + 1);
    }
    if (activeSceneIndex - 1 >= 0) {
      markSceneAsLoaded(activeSceneIndex - 1);
    }
  }, [activeSceneIndex]);

  useEffect(() => {
    // Determine the active section during scroll to cross-fade between gym training scenes
    const sectionIds = ['hero', 'servicos', 'treinos', 'prova-social', 'faq', 'contato'];

    const handleScroll = () => {
      // Trigger threshold when section reaches upper-middle of viewport
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          if (scrollPosition >= elementTop) {
            const mappedIndex = i >= 4 ? 4 : i === 3 ? 3 : i === 2 ? 2 : i === 1 ? 1 : 0;
            setActiveSceneIndex(mappedIndex);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial detection

    // Background idle prefetch: after 2 seconds, gracefully warm up remaining background images
    // when main thread is idle, ensuring zero jitter on mobile networks
    const preloadAllOnIdle = () => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
          setLoadedSceneIndices(new Set(BACKGROUND_SCENES.map((_, i) => i)));
        });
      } else {
        setLoadedSceneIndices(new Set(BACKGROUND_SCENES.map((_, i) => i)));
      }
    };

    idleTimerRef.current = window.setTimeout(preloadAllOnIdle, 2200);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      id="fixed-gym-background-layer"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 
        OPTIMIZED RESPONSIVE PHOTOGRAPHIC BACKGROUNDS (WebP + Lazy Loading)
        - Modern WebP format with responsive srcset (<768px loads ultra-lightweight mobile WebP ~45KB)
        - Progressive lazy loading preserves mobile bandwidth and guarantees sub-second initial paint
        - Cross-fading smooth transitions while page content glides over the fixed layer
      */}
      {BACKGROUND_SCENES.map((scene, index) => {
        const isLoaded = loadedSceneIndices.has(index);
        const isActive = activeSceneIndex === index;

        return (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {isLoaded ? (
              <picture className="w-full h-full">
                {/* Mobile WebP (max-width: 768px): ~40-70KB */}
                <source
                  media="(max-width: 768px)"
                  srcSet={`${scene.mobileWebp} 1x, ${scene.webp} 2x`}
                  type="image/webp"
                />
                {/* Desktop WebP: High fidelity ~75-160KB */}
                <source
                  srcSet={scene.webp}
                  type="image/webp"
                />
                {/* Fallback standard JPG */}
                <img
                  src={scene.src}
                  alt={scene.alt}
                  draggable={false}
                  className="w-full h-full object-cover object-center scale-100 brightness-105 contrast-115 saturate-110 opacity-100"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
              </picture>
            ) : (
              // Lightweight placeholder until scene is needed
              <div className="w-full h-full bg-[#050505]" />
            )}
          </div>
        );
      })}

      {/* 
        CALIBRATED TRANSLUCENT OVERLAY:
        Subtle tint ensuring the gym, athletes, dumbbells and equipment are distinctly sharp and visible,
        while maintaining crisp readability of the foreground text.
      */}
      <div className="absolute inset-0 bg-[#050505]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/50" />
    </div>
  );
};
