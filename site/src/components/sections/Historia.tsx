'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { animate, onScroll, createScope } from 'animejs';
import Reveal from '@/components/anim/Reveal';

const MILESTONE_KEYS = ['pasion', 'tecnica', 'academia', 'hoy'] as const;
const MILESTONE_NUMBERS: Record<string, string> = {
  pasion: '01',
  tecnica: '02',
  academia: '03',
  hoy: '04',
};

export default function Historia() {
  const t = useTranslations('historia');
  const sectionRef = useRef<HTMLElement>(null);
  // The animated gold fill-line (scaleY from 0 → 1)
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const section = sectionRef.current;
    if (!line || !section) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Under reduced-motion: leave line fully visible (scaleY remains 1) and return early
    if (reduce) return;

    // Start hidden — set scaleY to 0 via JS so reduced-motion users see the full line
    line.style.transformOrigin = 'top';
    line.style.transform = 'scaleY(0)';

    const scope = createScope({ root: section }).add(() => {
      animate(line, {
        scaleY: [0, 1],
        ease: 'linear',
        autoplay: onScroll({
          target: section,
          enter: 'bottom-=10% top',
          leave: 'bottom top',
          sync: true,
          axis: 'y',
        }),
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="py-24 px-6 bg-carbon overflow-hidden"
      aria-labelledby="historia-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Section header ─────────────────────────────────────────── */}
        <Reveal>
          <div data-reveal className="text-center mb-16">
            <p className="font-sans text-oro-light text-xs tracking-[0.3em] uppercase mb-4">
              Alina Kaminska Beauty Academy
            </p>
            <h2
              id="historia-heading"
              className="font-display font-light text-crema text-5xl sm:text-6xl md:text-7xl leading-tight mb-6"
            >
              {t('title')}
            </h2>
            <div className="mx-auto w-16 h-px bg-oro-light mb-8" aria-hidden="true" />
            <p className="font-sans text-crema/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {t('body')}
            </p>
          </div>
        </Reveal>

        {/* ── Two-column: timeline left + image right ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Timeline column ──────────────────────────────────────── */}
          <div className="relative">
            {/*
              Track layer: full-height, 1px wide, anchored to the centre of the dot column.
              Two divs stacked: a static dim track (always visible) and an animated gold
              fill div (scaleY 0→1 driven by onScroll sync). Both have transform-origin:top.
              Reduced-motion users see the full gold line because JS never hides it.
            */}
            <div
              aria-hidden="true"
              className="absolute left-[19px] top-5 bottom-5 w-px pointer-events-none"
            >
              {/* Static dim track */}
              <div className="absolute inset-0 bg-oro-light/20" />
              {/* Animated gold fill (scaleY driven by scroll) */}
              <div
                ref={lineRef}
                className="absolute inset-0 bg-oro-light/60"
                style={{ transformOrigin: 'top' }}
              />
            </div>

            {/* Milestones */}
            <Reveal>
              <ol className="relative list-none p-0 m-0 space-y-12" role="list">
                {MILESTONE_KEYS.map((key) => (
                  <li
                    key={key}
                    data-reveal
                    className="flex gap-8 items-start pl-12 relative"
                  >
                    {/* Dot */}
                    <span
                      className="absolute left-0 top-1 w-10 h-10 rounded-full border border-oro-light/50 bg-carbon flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <span className="font-sans text-oro-light text-[10px] tracking-widest font-medium">
                        {MILESTONE_NUMBERS[key]}
                      </span>
                    </span>

                    {/* Content */}
                    <div>
                      <h3 className="font-display text-crema text-2xl sm:text-3xl font-light leading-snug mb-2">
                        {t(`milestones.${key}.title`)}
                      </h3>
                      <p className="font-sans text-crema/55 text-sm sm:text-base leading-relaxed max-w-sm">
                        {t(`milestones.${key}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* ── Editorial image ──────────────────────────────────────── */}
          <Reveal className="lg:sticky lg:top-24 self-start">
            <div data-reveal>
              {/* Decorative offset frame */}
              <div className="relative">
                {/* Gold accent frame behind image */}
                <div
                  className="absolute -top-3 -right-3 w-full h-full border border-oro-light/20 pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src="/ig/09-belleza-criterio.webp"
                    alt={t('img_alt')}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {/* Subtle gradient vignette */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-carbon/50 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* Caption bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-px bg-oro-light" aria-hidden="true" />
                  <p className="font-sans text-crema/55 text-xs tracking-[0.25em] uppercase">
                    {t('img_caption')}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
