'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/anim/Reveal';
import { services } from '@/lib/services';

export default function Servicios() {
  const t = useTranslations('servicios');

  return (
    <section
      id="servicios"
      className="py-24 px-6 bg-crema"
      aria-labelledby="servicios-heading"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2
          id="servicios-heading"
          className="font-display font-light text-carbon text-5xl sm:text-6xl md:text-7xl leading-tight mb-5"
        >
          {t('title')}
        </h2>
        <p className="font-sans text-carbon/70 text-base sm:text-lg tracking-widest uppercase">
          {t('lead')}
        </p>
        {/* Decorative gold rule */}
        <div className="mt-8 mx-auto w-16 h-px bg-oro" aria-hidden="true" />
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <Reveal className="max-w-6xl mx-auto">
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none p-0 m-0"
          role="list"
        >
          {services.map(({ key, img, items }) => (
            <li
              key={key}
              data-reveal
              className="group relative overflow-hidden bg-crema border border-oro/20 cursor-default
                         transition-shadow duration-400 hover:shadow-[0_8px_40px_rgba(140,93,73,0.20)]"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={img}
                  alt={t(`items_alt.${key}`)}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* subtle vignette */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-carbon/40 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* Caption */}
              <div className="px-5 pt-5 pb-4 border-t border-oro/20">
                <h3 className="font-display text-carbon text-xl font-light tracking-wide mb-4">
                  {t(`cat.${key}`)}
                </h3>
                <ul className="space-y-2 list-none p-0 m-0" role="list">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-baseline justify-between gap-4 border-b border-oro/10 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="font-sans text-carbon/80 text-sm leading-snug">
                        {t(`sub.${key}.${item.key}`)}
                      </span>
                      <span className="font-sans text-oro text-sm font-medium whitespace-nowrap flex-shrink-0">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
