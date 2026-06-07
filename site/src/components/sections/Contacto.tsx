'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Reveal from '@/components/anim/Reveal';
import { services } from '@/lib/services';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '34603243621';
const ADDRESS = 'Av. Dr. Gregorio Marañón 7/8, 03181 Torrevieja, Alicante';
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

export default function Contacto() {
  const t = useTranslations('contacto');
  const tServ = useTranslations('servicios');
  const locale = useLocale();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, service, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || t('form_error'));
      }
      setStatus('ok');
      setName('');
      setContact('');
      setService('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : t('form_error')
      );
    }
  }

  const waText = encodeURIComponent(t('wa_text'));
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const inputClass =
    'w-full bg-white border border-oro/20 text-carbon font-sans text-sm px-4 py-3 rounded-sm ' +
    'placeholder-carbon/30 focus:outline-none focus:border-oro focus:ring-1 focus:ring-oro ' +
    'transition-colors';

  return (
    <section
      id="contacto"
      className="py-24 px-6 bg-crema"
      aria-labelledby="contacto-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-16">
          <h2
            id="contacto-heading"
            className="font-display font-light text-carbon text-5xl sm:text-6xl md:text-7xl leading-tight mb-5"
          >
            {t('title')}
          </h2>
          <div className="mt-8 mx-auto w-16 h-px bg-oro" aria-hidden="true" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Form + WhatsApp */}
          <Reveal>
            <div className="bg-white border border-oro/10 p-8 rounded-sm shadow-sm">
              {status === 'ok' ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center justify-center py-10 gap-4 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-full bg-oro/10 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="#8c5d49"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-display text-carbon text-xl font-light">{t('form_ok')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <fieldset disabled={status === 'loading'} className="border-0 p-0 m-0">
                    <legend className="sr-only">{t('title')}</legend>

                    {/* Name */}
                    <div className="mb-5">
                      <label
                        htmlFor="contacto-name"
                        className="block font-sans text-xs tracking-widest uppercase text-carbon/70 mb-2"
                      >
                        {t('form_name')} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contacto-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('form_name')}
                        aria-required="true"
                        className={inputClass}
                      />
                    </div>

                    {/* Contact */}
                    <div className="mb-5">
                      <label
                        htmlFor="contacto-contact"
                        className="block font-sans text-xs tracking-widest uppercase text-carbon/70 mb-2"
                      >
                        {t('form_contact')} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contacto-contact"
                        type="text"
                        required
                        autoComplete="email"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={t('form_contact')}
                        aria-required="true"
                        className={inputClass}
                      />
                    </div>

                    {/* Service */}
                    <div className="mb-6">
                      <label
                        htmlFor="contacto-service"
                        className="block font-sans text-xs tracking-widest uppercase text-carbon/70 mb-2"
                      >
                        {t('form_service')}
                      </label>
                      <select
                        id="contacto-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className={inputClass + ' cursor-pointer'}
                      >
                        <option value="">{t('form_service')}</option>
                        {services.map(({ key }) => (
                          <option key={key} value={key}>
                            {tServ(`cat.${key}`)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Error message */}
                    {status === 'error' && (
                      <div
                        role="alert"
                        aria-live="assertive"
                        className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700 font-sans"
                      >
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 bg-oro text-crema font-sans text-sm tracking-widest uppercase
                                 hover:bg-oro-dark transition-colors rounded-sm
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-busy={status === 'loading'}
                    >
                      {status === 'loading' ? '…' : t('form_submit')}
                    </button>
                  </fieldset>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-oro/10" aria-hidden="true" />
                <span className="font-sans text-xs text-carbon/70 uppercase tracking-widest" aria-hidden="true">{t('divider_or')}</span>
                <div className="flex-1 h-px bg-oro/10" aria-hidden="true" />
              </div>

              {/* WhatsApp CTA */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3 border border-[#075E54] text-[#075E54]
                           font-sans text-sm tracking-wider uppercase rounded-sm
                           hover:bg-[#075E54] hover:text-white transition-colors
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#075E54] focus-visible:outline-offset-2"
                aria-label={t('whatsapp_aria')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('whatsapp')}
              </a>
            </div>
          </Reveal>

          {/* Right: Info + Map */}
          <Reveal className="flex flex-col gap-6">
            {/* Info block */}
            <div className="bg-white border border-oro/10 p-8 rounded-sm shadow-sm">
              <dl className="flex flex-col gap-5">
                <div>
                  <dt className="font-sans text-xs tracking-widest uppercase text-carbon/70 mb-1">
                    {t('label_address')}
                  </dt>
                  <dd className="font-sans text-sm text-carbon leading-relaxed">
                    {t('address')}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs tracking-widest uppercase text-carbon/70 mb-1">
                    {t('label_hours')}
                  </dt>
                  <dd className="font-sans text-sm text-carbon">{t('hours')}</dd>
                </div>
                <div>
                  <dt className="font-sans text-xs tracking-widest uppercase text-carbon/70 mb-1">
                    {t('label_phone')}
                  </dt>
                  <dd>
                    <a
                      href="tel:+34603243621"
                      className="font-sans text-sm text-carbon hover:text-oro transition-colors
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro rounded-sm"
                    >
                      +34 603 243 621
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Map */}
            <div className="rounded-sm overflow-hidden border border-oro/10 shadow-sm" style={{ height: '280px' }}>
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('map_title')}
                aria-label={t('map_aria')}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
