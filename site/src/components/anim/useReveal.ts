'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Reveal-on-scroll, one-shot. Robusto: usa IntersectionObserver para disparar a
 * animação anime.js uma única vez quando o contentor entra no viewport, e NUNCA
 * reverte (ao contrário do onScroll por defeito do anime.js v4, que deixava o
 * conteúdo a opacity:0). O estado inicial escondido é aplicado por JS, por isso
 * utilizadores sem JS / com prefers-reduced-motion veem sempre o conteúdo.
 */
export function useReveal() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // sem animação — conteúdo fica visível no estado natural

    // estado inicial escondido (só via JS → no-JS continua a ver tudo)
    for (const t of targets) {
      t.style.opacity = '0';
      t.style.transform = 'translateY(40px)';
      t.style.willChange = 'opacity, transform';
    }

    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (played || !entries.some((e) => e.isIntersecting)) return;
        played = true;
        io.disconnect();
        animate(targets, {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 800,
          ease: 'outQuad',
          delay: stagger(90),
          onComplete: () => {
            for (const t of targets) t.style.willChange = 'auto';
          },
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return root;
}
