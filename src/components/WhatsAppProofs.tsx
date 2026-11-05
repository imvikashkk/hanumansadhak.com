'use client';

import Image from 'next/image';
import { useState } from 'react';
import { hasSrc, WHATSAPP_PROOFS } from '@/data/media';
import { whatsappLink } from '@/data/site';
import { Mandala } from './CreamDecor';
import Icon from './Icon';
import Lightbox from './Lightbox';
import { Reveal } from './Reveal';

// "WhatsApp पर भक्तों के संदेश" — the devotees' screenshots, each in a phone frame.
// Sits on the dark ground between two cream bands; a swipeable row on phones, a grid from sm up.
export default function WhatsAppProofs() {
  const proofs = hasSrc(WHATSAPP_PROOFS);
  const [open, setOpen] = useState<number | null>(null);
  if (proofs.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24" aria-labelledby="wa-heading">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-mandala absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_30%,black)]" />
        <div className="absolute left-1/2 top-10 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-[#25d366]/10 blur-[110px]" />
        <Mandala className="animate-spin-slow absolute -left-48 top-1/3 w-[26rem] text-[var(--gold)] opacity-[0.08]" style={{ animationDuration: '160s' }} />
        <Mandala
          className="animate-spin-slow absolute -right-48 bottom-0 w-[26rem] text-[var(--gold)] opacity-[0.08]"
          style={{ animationDuration: '190s', animationDirection: 'reverse' }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#25d366]/50 bg-[#25d366]/10 px-4 py-1 text-sm font-bold text-[#7ee2a3]">
            <Icon name="whatsapp" /> सीधे भक्तों से
          </span>
          <h2 id="wa-heading" className="mt-4 font-display text-[2.1rem] leading-tight sm:text-5xl">
            WhatsApp पर <span className="text-ember">भक्तों के संदेश</span>
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-[var(--gold)]" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
            <Icon name="lotus" className="text-xl" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>
          <p className="mt-3 text-base text-[var(--muted-foreground)] sm:text-lg">साधना के बाद भक्तों के भेजे गए असली संदेश</p>
        </Reveal>

        <div className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {proofs.map((img, i) => (
            <Reveal key={img.src} delay={(i % 4) * 90} className="w-[64%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`बड़ा देखें: ${img.alt}`}
                className="group block w-full cursor-zoom-in rounded-[2rem] bg-gradient-to-b from-[#4a4a4a] via-[#1c1c1c] to-[#3a3a3a] p-[3px] shadow-[0_30px_60px_-30px_black] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgb(37_211_102/0.35)]"
              >
                {/* phone body with a notch */}
                <span className="relative block overflow-hidden rounded-[calc(2rem-3px)] border-[6px] border-black bg-black">
                  <span className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
                  <span className="relative block aspect-[9/16]">
                    <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 64vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/85 to-transparent pb-3 pt-10 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    <Icon name="sparkle" /> बड़ा देखें
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-col items-center gap-2 text-center">
          <a
            href={whatsappLink('नमस्ते, मुझे हनुमान साधना के बारे में जानकारी चाहिए')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25d366] px-6 font-bold text-white shadow-[0_14px_34px_-12px_#25d366] transition hover:scale-[1.03]"
          >
            <Icon name="whatsapp" className="text-xl" /> आप भी WhatsApp पर पूछें
          </a>
          <p className="text-sm text-[var(--muted-foreground)]">कोई भी सवाल — हम जवाब देंगे</p>
        </Reveal>
      </div>

      {open !== null && <Lightbox images={proofs} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
