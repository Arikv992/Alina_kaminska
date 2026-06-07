'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { animate, createTimeline, createScope, splitText, stagger } from 'animejs';

const HERO_IMAGES = [
  { src: '/generated/hero-manicura.webp', alt: 'Manicura de lujo en tonos nude y oro' },
  { src: '/generated/hero-pestanas.webp', alt: 'Extensión de pestañas y diseño de cejas' },
  { src: '/generated/hero-manos-detalle.webp', alt: 'Manicura nude impecable sobre cachemir crema' },
];

export default function Hero() {
  const t = useTranslations('hero');
  const root = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  // ── Background crossfade slideshow (paused under prefers-reduced-motion) ──
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // fica na 1ª imagem, sem crossfade
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  // ── Entrance animations (logo / headline / subtitle / cta / scroll) ──
  useEffect(() => {
    if (!root.current) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      // Restore visibility — elements have opacity:0 in JSX as animation start state
      for (const r of [logoRef, subtitleRef, ctaRef, scrollRef]) {
        if (r.current) r.current.style.opacity = '1';
      }
      return;
    }

    const logo = logoRef.current;
    const headline = headlineRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const scrollEl = scrollRef.current;

    if (!logo || !headline || !subtitle || !cta) return;

    const scope = createScope({ root: root.current }).add(() => {
      const tl = createTimeline({ defaults: { ease: 'outExpo' } });

      // --- Logo entrance: fade + subtle scale (filled SVG, no line-draw) ---
      tl.add(logo, { opacity: [0, 1], scale: [0.88, 1], duration: 900, ease: 'outBack(1.4)' }, 0);

      // --- Headline: split by word, staggered reveal ---
      const { words } = splitText(headline, { words: true });
      tl.add(
        words,
        { opacity: [0, 1], translateY: [28, 0], duration: 780, delay: stagger(70, { from: 'first' }), ease: 'outExpo' },
        '+=100',
      );

      // --- Subtitle: fade-up after headline ---
      tl.add(subtitle, { opacity: [0, 1], translateY: [18, 0], duration: 600 }, '-=400');

      // --- CTA: fade-up, slight delay ---
      tl.add(cta, { opacity: [0, 1], translateY: [14, 0], duration: 500 }, '-=300');

      // --- Scroll indicator: fade in last ---
      if (scrollEl) {
        tl.add(scrollEl, { opacity: [0, 1], duration: 400 }, '-=100');

        // Gentle looping nudge on the scroll arrow
        const arrow = scrollEl.querySelector<HTMLElement>('.scroll-arrow');
        if (arrow) {
          animate(arrow, { translateY: [0, 8], duration: 900, direction: 'alternate', loop: true, ease: 'inOutSine' });
        }
      }
    });

    return () => scope.revert();
  }, []);

  function handleCta(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      ref={root}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-carbon"
      aria-label="Hero"
    >
      {/* ── Background slideshow (crossfade + Ken Burns) ──────────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover kenburns"
            />
          </div>
        ))}
      </div>

      {/* ── Overlay gradient (keeps logo, subtitle and CTA legible) ───── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,20,20,0.62) 0%, rgba(20,20,20,0.20) 38%, rgba(255,255,255,0.08) 55%, rgba(20,20,20,0.55) 80%, rgba(20,20,20,0.85) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-7 px-6 py-16 text-center max-w-3xl mx-auto">
        {/* Logo */}
        <div ref={logoRef} className="mb-2" style={{ opacity: 0 }}>
          <Image
            src="/brand/logo.svg"
            alt="Alina Kaminska Beauty Academy"
            width={96}
            height={78}
            priority
            className="drop-shadow-[0_0_18px_rgba(140,93,73,0.45)]"
          />
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-light text-crema text-5xl sm:text-6xl md:text-7xl leading-[1.08] tracking-tight"
        >
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-sans text-crema/80 text-base sm:text-lg tracking-widest uppercase"
          style={{ opacity: 0 }}
        >
          {t('subtitle')}
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="#contacto"
          onClick={handleCta}
          className="mt-2 inline-block px-10 py-3.5 border border-crema text-crema font-sans text-sm tracking-widest uppercase
                     transition-colors duration-300
                     hover:bg-crema hover:text-carbon
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crema focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
          style={{ opacity: 0 }}
        >
          {t('cta')}
        </a>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <span className="font-sans text-crema/50 text-[10px] tracking-[0.25em] uppercase">scroll</span>
        <svg className="scroll-arrow w-5 h-5 text-oro-light/70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
