const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alinakaminskabeautyacademy.com';

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Alina Kaminska Beauty Academy',
    url: SITE_URL,
    telephone: '+34603243621',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Dr. Gregorio Marañón 7/8',
      postalCode: '03181',
      addressLocality: 'Torrevieja',
      addressRegion: 'Alicante',
      addressCountry: 'ES',
    },
    openingHours: ['Mo-Fr 09:30-17:00'],
    sameAs: [
      'https://www.instagram.com/alinakaminskabeautyacademy/',
      'https://www.facebook.com/p/Alina-Kaminska-Beauty-Academy-61558314691302/',
    ],
    image: `${SITE_URL}/ig/11-lujo-detalles-manicura.webp`,
  };
}

export { SITE_URL };
