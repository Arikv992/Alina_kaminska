'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = {
  es: 'ES',
  en: 'EN',
  pl: 'PL',
  it: 'IT',
};

const LANG_NAMES: Record<string, string> = {
  es: 'Español',
  en: 'English',
  pl: 'Polski',
  it: 'Italiano',
};

/** Inline SVG flags (viewBox 60×40) — reliable across platforms, unlike emoji flags. */
function Flag({ code }: { code: string }) {
  switch (code) {
    case 'es':
      return (
        <svg viewBox="0 0 60 40" aria-hidden="true" className="block w-full h-full">
          <rect width="60" height="40" fill="#c60b1e" />
          <rect y="10" width="60" height="20" fill="#ffc400" />
        </svg>
      );
    case 'it':
      return (
        <svg viewBox="0 0 60 40" aria-hidden="true" className="block w-full h-full">
          <rect width="60" height="40" fill="#fff" />
          <rect width="20" height="40" fill="#008c45" />
          <rect x="40" width="20" height="40" fill="#cd212a" />
        </svg>
      );
    case 'pl':
      return (
        <svg viewBox="0 0 60 40" aria-hidden="true" className="block w-full h-full">
          <rect width="60" height="40" fill="#fff" />
          <rect y="20" width="60" height="20" fill="#dc143c" />
        </svg>
      );
    case 'en':
    default:
      // Simplified Union Jack — overflow is clipped by the SVG viewport.
      return (
        <svg viewBox="0 0 60 40" aria-hidden="true" className="block w-full h-full">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0,0 60,40 M60,0 0,40" stroke="#fff" strokeWidth="7" />
          <path d="M0,0 60,40 M60,0 0,40" stroke="#c8102e" strokeWidth="3" />
          <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12" />
          <path d="M30,0 V40 M0,20 H60" stroke="#c8102e" strokeWidth="7" />
        </svg>
      );
  }
}

function FlagBadge({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={
        'inline-block overflow-hidden rounded-[2px] ring-1 ring-black/10 shrink-0 ' +
        (className ?? 'w-[18px] h-[12px]')
      }
    >
      <Flag code={code} />
    </span>
  );
}

type Props = {
  /** 'light' for use on pale backgrounds (header), 'dark' for dark bands (footer). */
  variant?: 'light' | 'dark';
  /** Direction the menu opens. 'up' for elements near the page bottom (footer). */
  align?: 'down' | 'up';
};

export default function LanguageSwitcher({ variant = 'light', align = 'down' }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on click-outside and on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function choose(next: string) {
    setOpen(false);
    if (next !== locale) router.replace(pathname, { locale: next });
  }

  const triggerColors =
    variant === 'dark'
      ? 'text-crema/80 hover:text-crema border-crema/20 hover:border-crema/40'
      : 'text-carbon/80 hover:text-oro border-oro/25 hover:border-oro/50';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma — ${LANG_NAMES[locale]}`}
        className={[
          'inline-flex items-center gap-2 px-2.5 py-1.5 border rounded-full transition-colors',
          'font-sans text-xs tracking-widest uppercase',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-1',
          triggerColors,
        ].join(' ')}
      >
        <FlagBadge code={locale} />
        <span>{LABELS[locale]}</span>
        <svg
          viewBox="0 0 24 24"
          className={'w-3 h-3 transition-transform duration-200 ' + (open ? 'rotate-180' : '')}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language selector"
          className={[
            'dropdown-in absolute right-0 z-50 min-w-[150px] py-1.5',
            'bg-crema border border-oro/15 rounded-lg shadow-[0_12px_40px_rgba(20,20,20,0.18)]',
            align === 'up' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top',
          ].join(' ')}
        >
          {routing.locales.map((loc) => {
            const active = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(loc)}
                  className={[
                    'w-full flex items-center gap-3 px-3.5 py-2 text-left transition-colors',
                    'font-sans text-sm',
                    'focus-visible:outline-none focus-visible:bg-oro/10',
                    active ? 'text-oro font-medium' : 'text-carbon/80 hover:bg-oro/10 hover:text-oro',
                  ].join(' ')}
                >
                  <FlagBadge code={loc} className="w-5 h-3.5" />
                  <span className="flex-1">{LANG_NAMES[loc]}</span>
                  {active && (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-oro" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
