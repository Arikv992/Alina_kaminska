'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'servicios', href: '#servicios' },
  { key: 'academia', href: '#academia' },
  { key: 'galeria', href: '#galeria' },
  { key: 'historia', href: '#historia' },
  { key: 'contacto', href: '#contacto' },
] as const;

function scrollTo(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-crema/80 backdrop-blur-md border-b border-oro/10"
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label={t('home')}
          className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 rounded-sm"
        >
          {/* Dark medallion so the gold/cream emblem stays visible on the light header */}
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-carbon ring-1 ring-oro/25 shadow-sm shrink-0">
            <Image
              src="/brand/logo.svg"
              alt="Alina Kaminska Beauty Academy"
              width={44}
              height={36}
              priority
              className="h-8 w-auto"
            />
          </span>
          <span className="font-display text-carbon text-lg font-light hidden sm:block tracking-wide">
            Alina Kaminska
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label={t('main_nav')} className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={(e) => handleAnchor(e, href)}
              className="font-sans text-sm text-carbon/70 hover:text-oro transition-colors tracking-wide
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 rounded-sm"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        {/* Right side: Language switcher + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => scrollTo('#contacto')}
            className="px-4 py-2 bg-oro text-crema font-sans text-sm tracking-wider uppercase
                       hover:bg-oro-dark transition-colors rounded-sm
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2"
            aria-label={t('reservar')}
          >
            {t('reservar')}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-carbon hover:text-oro transition-colors
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 rounded-sm"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('close_menu') : t('open_menu')}
        >
          <span className="sr-only">{open ? t('close_menu') : t('open_menu')}</span>
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden bg-crema/95 backdrop-blur-md border-t border-oro/10 px-6 py-4"
        >
          <nav aria-label={t('mobile_nav')} className="flex flex-col gap-3">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="font-sans text-base text-carbon/70 hover:text-oro transition-colors tracking-wide py-1
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 rounded-sm"
              >
                {t(key)}
              </a>
            ))}
            <div className="pt-2 border-t border-oro/10 flex items-center justify-between">
              <LanguageSwitcher />
              <button
                onClick={() => { setOpen(false); scrollTo('#contacto'); }}
                className="px-4 py-2 bg-oro text-crema font-sans text-sm tracking-wider uppercase
                           hover:bg-oro-dark transition-colors rounded-sm
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2"
              >
                {t('reservar')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
