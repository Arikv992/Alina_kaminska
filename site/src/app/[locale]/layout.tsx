import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import { localBusinessJsonLd, SITE_URL } from "@/lib/seo";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

/* ── Per-locale metadata titles / descriptions ───────────────────────── */
const META: Record<string, { title: string; description: string }> = {
  es: {
    title: "Alina Kaminska Beauty Academy | Estética y Formación en Torrevieja",
    description:
      "Salón de estética y academia de belleza en Torrevieja, Alicante. Manicura, extensiones, diseño de cejas y cursos certificados.",
  },
  en: {
    title: "Alina Kaminska Beauty Academy | Beauty Salon & Training in Torrevieja",
    description:
      "Beauty salon and professional training academy in Torrevieja, Alicante. Manicure, lash extensions, eyebrow design and certified courses.",
  },
  pl: {
    title: "Alina Kaminska Beauty Academy | Salon piękności i akademia w Torrevieja",
    description:
      "Salon kosmetyczny i akademia szkoleniowa w Torrevieja, Alicante. Manicure, rzęsy, brwi i certyfikowane kursy.",
  },
  it: {
    title: "Alina Kaminska Beauty Academy | Centro Estetico e Accademia a Torrevieja",
    description:
      "Centro estetico e accademia di formazione a Torrevieja, Alicante. Manicure, estensioni ciglia, disegno sopracciglia e corsi certificati.",
  },
};

/* Locale → URL prefix mapping (es = no prefix because localePrefix: 'as-needed') */
const LOCALE_URLS: Record<string, string> = {
  es: SITE_URL,
  en: `${SITE_URL}/en`,
  pl: `${SITE_URL}/pl`,
  it: `${SITE_URL}/it`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.es;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: LOCALE_URLS[locale],
      languages: {
        "x-default": SITE_URL,
        es: LOCALE_URLS.es,
        en: LOCALE_URLS.en,
        pl: LOCALE_URLS.pl,
        it: LOCALE_URLS.it,
      },
    },
    openGraph: {
      type: "website",
      url: LOCALE_URLS[locale],
      title: meta.title,
      description: meta.description,
      siteName: "Alina Kaminska Beauty Academy",
      images: [
        {
          url: "/ig/11-lujo-detalles-manicura.webp",
          width: 1200,
          height: 630,
          alt: "Alina Kaminska Beauty Academy — manicura de lujo",
        },
      ],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/ig/11-lujo-detalles-manicura.webp"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const jsonLd = localBusinessJsonLd();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-crema text-carbon">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
