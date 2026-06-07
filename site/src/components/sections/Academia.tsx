'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/anim/Reveal';

const COURSE_KEYS = ['manicura', 'pestanas', 'cejas'] as const;
type CourseKey = (typeof COURSE_KEYS)[number];

const COURSE_IMGS: Record<CourseKey, string> = {
  manicura: '/ig/04-formacion-manicure.webp',
  pestanas: '/ig/05-certificacion-cursos.webp',
  cejas: '/ig/09-belleza-criterio.webp',
};

function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
}

export default function Academia() {
  const t = useTranslations('academia');

  return (
    <section
      id="academia"
      className="py-24 px-6 bg-carbon overflow-hidden"
      aria-labelledby="academia-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Editorial block ──────────────────────────────────────────── */}
        <Reveal>
          <div
            data-reveal
            className="text-center mb-16"
          >
            <p className="font-sans text-oro-light text-xs tracking-[0.3em] uppercase mb-4">
              Alina Kaminska Beauty Academy
            </p>
            <h2
              id="academia-heading"
              className="font-display font-light text-crema text-5xl sm:text-6xl md:text-7xl leading-tight mb-6"
            >
              {t('title')}
            </h2>
            <p className="font-sans text-crema/60 text-base sm:text-lg tracking-widest uppercase mb-8">
              {t('lead')}
            </p>
            <div className="mx-auto w-16 h-px bg-oro-light mb-8" aria-hidden="true" />
            <p className="font-sans text-crema/75 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {t('body')}
            </p>
          </div>
        </Reveal>

        {/* ── Course cards ─────────────────────────────────────────────── */}
        <Reveal className="mb-14">
          <ul
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none p-0 m-0"
            role="list"
          >
            {COURSE_KEYS.map((key) => (
              <li
                key={key}
                data-reveal
                className="group relative overflow-hidden border border-oro-light/20
                           transition-shadow duration-400 hover:shadow-[0_8px_40px_rgba(140,93,73,0.28)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={COURSE_IMGS[key]}
                    alt={t(`courses.${key}.alt`)}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-carbon/10 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                  <p className="font-display text-crema text-xl font-light leading-snug">
                    {t(`courses.${key}.label`)}
                  </p>
                  <p className="font-sans text-oro-light/90 text-xs tracking-widest uppercase mt-1">
                    {t('certified')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── Online badge + CTA ───────────────────────────────────────── */}
        <Reveal>
          <div data-reveal className="flex flex-col items-center gap-8 text-center">
            {/* Online soon pill */}
            <div className="inline-flex items-center gap-2 border border-oro-light/30 px-5 py-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-oro-light/60 animate-pulse"
                aria-hidden="true"
              />
              <span className="font-sans text-crema/50 text-xs tracking-[0.25em] uppercase">
                {t('online_soon')}
              </span>
            </div>

            {/* CTA button */}
            <a
              href="#contacto"
              onClick={handleCtaClick}
              className="inline-block px-12 py-4 border border-crema text-crema font-sans text-sm tracking-widest uppercase
                         transition-colors duration-300
                         hover:bg-crema hover:text-carbon
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crema focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
            >
              {t('cta')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
