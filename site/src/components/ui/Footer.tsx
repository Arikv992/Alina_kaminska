import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const INSTAGRAM = 'https://www.instagram.com/alinakaminskabeautyacademy/';
const FACEBOOK = 'https://www.facebook.com/p/Alina-Kaminska-Beauty-Academy-61558314691302/';

export default function Footer() {
  const t = useTranslations('footer');
  const tContact = useTranslations('contacto');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-carbon text-crema" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand + address */}
          <div>
            <p className="font-display text-2xl font-light mb-4 tracking-wide">
              Alina Kaminska<br />Beauty Academy
            </p>
            <address className="not-italic font-sans text-sm text-crema/60 leading-relaxed">
              Av. Dr. Gregorio Marañón 7/8<br />
              03181 Torrevieja, Alicante<br />
              <a
                href="tel:+34603243621"
                className="hover:text-oro-light transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-light rounded-sm"
              >
                +34 603 243 621
              </a>
            </address>
            <p className="font-sans text-sm text-crema/60 mt-2">
              {t('hours')}
            </p>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs tracking-widest uppercase text-crema/55 mb-1">
              {t('social_heading')}
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-crema/70 hover:text-oro-light transition-colors flex items-center gap-2
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-light rounded-sm"
              aria-label={t('instagram_aria')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              Instagram
            </a>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-crema/70 hover:text-oro-light transition-colors flex items-center gap-2
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro-light rounded-sm"
              aria-label={t('facebook_aria')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Facebook
            </a>
          </div>

          {/* Kit Digital badge + language switcher */}
          <div className="flex flex-col gap-6">
            <div
              className="border border-oro-light/30 rounded-sm px-4 py-3 inline-flex flex-col gap-1 w-fit"
              aria-label={t('kit_digital_aria')}
            >
              <span className="font-sans text-xs tracking-widest uppercase text-oro-light">
                Kit Digital
              </span>
              <span className="font-sans text-xs text-crema/50 leading-tight">
                {t('kit_digital_funded')}<br />
                {t('kit_digital_eu')}
              </span>
            </div>

            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-crema/55 mb-2">
                {t('lang_heading')}
              </p>
              {/* Dark variant + opens upward (footer sits at the page bottom) */}
              <LanguageSwitcher variant="dark" align="up" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-crema/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-crema/50">
            © {year} Alina Kaminska Beauty Academy. {t('copyright')}
          </p>
          <p className="font-sans text-xs text-crema/50">
            {t('location')}
          </p>
        </div>
      </div>
    </footer>
  );
}
