'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/anim/Reveal';

// ---------- media catalogue ----------
type ImageItem = {
  kind: 'image';
  src: string;
  altKey: string;
  width: number;
  height: number;
};

type VideoItem = {
  kind: 'video';
  src: string;
  poster: string;
  altKey: string;
  width: number;
  height: number;
};

type MediaItem = ImageItem | VideoItem;

const BOOKSY_URL =
  'https://booksy.com/es-es/66511_alina-kaminska-beauty-academy-coworking-space_maquillaje_56695_torrevieja';

const ITEMS: MediaItem[] = [
  // Real close-up lash photo — square
  {
    kind: 'image',
    src: '/booksy/insp-05.webp',
    altKey: 'insp_05',
    width: 1400,
    height: 1400,
  },
  // Real work collage — landscape
  {
    kind: 'image',
    src: '/booksy/biz-01.webp',
    altKey: 'insp_biz',
    width: 1400,
    height: 933,
  },
  // Video card — UV lash extension course
  {
    kind: 'video',
    src: '/ig/videos/DSsjf7vjHd6-kurs-uv-lashes.mp4',
    poster: '/ig/01-kurs-uv-light-lashes.webp',
    altKey: 'video_lashes',
    width: 640,
    height: 1139,
  },
];

// ---------- video card ----------
function VideoCard({ item, tPlay, tPause, tVideoLabel, tAlt }: {
  item: VideoItem;
  tPlay: string;
  tPause: string;
  tVideoLabel: string;
  tAlt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const aspectStyle: React.CSSProperties = {
    aspectRatio: `${item.width} / ${item.height}`,
  };

  const ariaLabel = playing
    ? tPause.replace('{alt}', tAlt)
    : tPlay.replace('{alt}', tAlt);

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative w-full overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-carbon cursor-pointer"
      style={aspectStyle}
      aria-label={ariaLabel}
    >
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        preload="metadata"
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={tAlt}
      />
      {/* play/pause overlay */}
      <span
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: playing ? 0 : 1 }}
        aria-hidden="true"
      >
        {/* Backdrop blur dot */}
        <span className="w-14 h-14 rounded-full bg-carbon/60 backdrop-blur-sm flex items-center justify-center border border-oro-light/40">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-oro-light translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      {/* "video" label */}
      <span className="absolute bottom-3 left-3 font-sans text-[9px] tracking-[0.3em] uppercase text-crema/60 bg-carbon/50 px-2 py-0.5 backdrop-blur-sm">
        {tVideoLabel}
      </span>
    </button>
  );
}

// ---------- section ----------
export default function Galeria() {
  const t = useTranslations('galeria');

  return (
    <section
      id="galeria"
      className="py-24 px-6 bg-crema"
      aria-labelledby="galeria-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <Reveal>
          <div data-reveal className="text-center mb-14">
            <p className="font-sans text-carbon/70 text-xs tracking-[0.3em] uppercase mb-4">
              Alina Kaminska
            </p>
            <h2
              id="galeria-heading"
              className="font-display font-light text-carbon text-5xl sm:text-6xl md:text-7xl leading-tight mb-4"
            >
              {t('title')}
            </h2>
            <div className="mx-auto w-16 h-px bg-oro mt-6 mb-10" aria-hidden="true" />

            {/* social proof — 5,0★ · 145 reviews on Booksy */}
            <div className="flex flex-col items-center gap-3">
              {/* star row */}
              <div className="flex items-center gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg
                    key={s}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-oro"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* rating + label */}
              <p className="font-display font-light text-carbon text-3xl leading-none">
                <span className="text-oro font-normal">{t('rating')}</span>
                <span className="sr-only"> — </span>
                <span className="font-sans text-base text-carbon/70 ml-2">
                  145 {t('reviews_label')}
                </span>
              </p>
              {/* Booksy link */}
              <a
                href={BOOKSY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block bg-oro text-crema border border-oro font-sans text-xs tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-oro-dark transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-crema"
              >
                {t('see_booksy')}
              </a>
            </div>
          </div>
        </Reveal>

        {/* 3-tile grid */}
        <Reveal>
          <ul
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 list-none p-0 m-0"
            role="list"
          >
            {ITEMS.map((item, i) => {
              const altText = t(`items.${item.altKey}`);
              return (
                <li
                  key={i}
                  data-reveal
                  className="overflow-hidden group"
                >
                  {item.kind === 'video' ? (
                    <VideoCard
                      item={item}
                      tPlay={t('play', { alt: altText })}
                      tPause={t('pause', { alt: altText })}
                      tVideoLabel={t('video_label')}
                      tAlt={altText}
                    />
                  ) : (
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: `${item.width} / ${item.height}` }}
                    >
                      <Image
                        src={item.src}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      {/* subtle gold shimmer on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(140,93,73,0.08) 0%, transparent 60%)',
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
