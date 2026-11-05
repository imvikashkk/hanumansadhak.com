'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { VideoTestimonial } from '@/data/media';
import { SITE } from '@/data/site';
import CheckoutButton from './CheckoutButton';
import Icon from './Icon';
import { Reveal } from './Reveal';
import { videoPoster } from './video/useVideoSource';
import VideoCard from './video/VideoCard';

// The interactive half of VideoTestimonials: big player + quote + thumbnail rail.
// Tapping a thumbnail moves it into the big player and plays it.
export default function StoriesPlayer({ stories }: { stories: VideoTestimonial[] }) {
  const [active, setActive] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // Keep the active thumbnail in view — scroll the rail only, never the page.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = rail?.children[active] as HTMLElement | undefined;
    if (!rail || !thumb) return;
    rail.scrollTo({ left: thumb.offsetLeft - (rail.clientWidth - thumb.clientWidth) / 2, behavior: 'smooth' });
  }, [active]);

  const story = stories[active];
  const go = (i: number, play = false) => {
    setAutoStart(play);
    setActive((i + stories.length) % stories.length);
  };

  return (
    <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
      {/* big player in a gold frame, with the sadhak-parivar seal */}
      <Reveal className="relative mx-auto w-full max-w-md">
        <div className="absolute -inset-5 rounded-[2.5rem] bg-ember opacity-20 blur-3xl" aria-hidden="true" />
        <div className="relative rounded-[1.6rem] p-[3px]">
          <div className="border-sweep absolute inset-0 rounded-[1.6rem]" aria-hidden="true" />
          <VideoCard
            key={story.src}
            video={story}
            shape="portrait"
            caption={false}
            badge={story.duration}
            autoStart={autoStart}
            sizes="(min-width: 1024px) 416px, 100vw"
          />
        </div>
        {stories.length > 1 && (
          <>
            <button
              onClick={() => go(active - 1)}
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold)]/60 bg-white/90 text-xl text-[var(--maroon)] shadow-card backdrop-blur-sm transition hover:scale-110 lg:-left-5"
              aria-label="पिछली कहानी"
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              onClick={() => go(active + 1)}
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--gold)]/60 bg-white/90 text-xl text-[var(--maroon)] shadow-card backdrop-blur-sm transition hover:scale-110 lg:-right-5"
              aria-label="अगली कहानी"
            >
              <Icon name="chevronRight" />
            </button>
          </>
        )}
        <div className="pointer-events-none absolute -right-3 -top-5 z-10 grid h-24 w-24 animate-float place-items-center rounded-full border-2 border-[var(--gold)] bg-[oklch(0.14_0.04_30)] text-center shadow-glow sm:-right-7 sm:h-28 sm:w-28">
          <span className="animate-spin-slow absolute inset-1.5 rounded-full border border-dashed border-[var(--gold)]/60" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block font-display text-lg text-ember sm:text-2xl">{SITE.devotees}</span>
            <span className="block text-[11px] font-semibold text-[#f7d77a] sm:text-xs">साधक परिवार</span>
          </span>
        </div>
      </Reveal>

      <div className="min-w-0">
        {/* quote of the playing story */}
        <figure
          key={story.src}
          className="relative rounded-2xl border border-[var(--maroon)]/10 border-l-4 border-l-[var(--sindoor)] bg-white/70 px-6 pb-5 pt-6 shadow-[0_22px_45px_-30px_var(--maroon)] backdrop-blur-sm"
          aria-live="polite"
        >
          <Icon name="quote" className="absolute -top-4 right-6 text-4xl text-[var(--gold)]" />
          <span className="flex gap-0.5 text-[var(--gold)]" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, k) => (
              <Icon key={k} name="star" />
            ))}
          </span>
          <blockquote className="mt-3 font-display text-2xl leading-snug text-[var(--maroon)] sm:text-[1.9rem]">
            “{story.quote}”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ember font-bold text-[var(--primary-foreground)]">
              {story.title[0]}
            </span>
            <span className="font-semibold text-[var(--sindoor)]">{story.title}</span>
          </figcaption>
        </figure>

        {/* the other stories */}
        {stories.length > 1 && (
          <>
            <div className="mt-8 flex items-center gap-3">
              <h3 className="font-display text-xl text-[var(--maroon)]">और कहानियाँ देखें</h3>
              <span className="h-px flex-1 bg-gradient-to-r from-[var(--gold)]/70 to-transparent" aria-hidden="true" />
              <span className="text-sm font-semibold text-[var(--maroon)]/60">
                {active + 1} / {stories.length}
              </span>
            </div>
            <div
              ref={railRef}
              className="relative -mx-4 mt-4 flex scroll-px-4 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-1 sm:scroll-px-0 [scrollbar-width:none] sm:mx-0 sm:gap-4 sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {stories.map((s, i) => {
                const poster = videoPoster(s);
                const isActive = i === active;
                return (
                  <button
                    key={s.src}
                    onClick={() => go(i, true)}
                    aria-label={`वीडियो चलाएं: ${s.title}`}
                    aria-current={isActive}
                    className="group w-[30%] shrink-0 snap-start self-start text-center sm:w-[calc((100%-3rem)/4)]"
                  >
                    <span
                      className={`relative block aspect-[3/4] overflow-hidden rounded-2xl border-2 bg-[var(--muted)] shadow-[0_18px_35px_-24px_var(--maroon)] transition duration-300 ${
                        isActive ? 'border-[var(--sindoor)]' : 'border-[var(--gold)]/40 group-hover:-translate-y-1 group-hover:border-[var(--gold)]'
                      }`}
                    >
                      {poster && (
                        <Image
                          src={poster}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 180px, (min-width: 640px) 25vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-full border border-white/80 bg-black/40 text-sm text-white backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[var(--sindoor)]">
                        <Icon name="play" className="ml-0.5" />
                      </span>
                      {s.duration && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 text-[11px] font-semibold tabular-nums text-white">
                          {s.duration}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute inset-x-0 top-0 bg-ember py-0.5 text-[11px] font-bold text-[var(--primary-foreground)]">
                          अभी देख रहे
                        </span>
                      )}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-xs leading-snug text-[var(--maroon)]/85 sm:text-sm">“{s.quote}”</span>
                    <span className="mt-1 block text-xs font-semibold text-[var(--sindoor)]">— {s.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center gap-2 lg:justify-start">
              {stories.map((s, i) => (
                <button
                  key={s.src}
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-[var(--sindoor)]' : 'w-2 bg-[var(--maroon)]/20 hover:bg-[var(--maroon)]/40'}`}
                  aria-label={`कहानी ${i + 1}`}
                  aria-current={i === active}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex justify-center lg:justify-start">
          <CheckoutButton placement="video-testimonials" size="md" />
        </div>
      </div>
    </div>
  );
}
