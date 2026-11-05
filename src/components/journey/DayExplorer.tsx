'use client';

import { useRef, useState } from 'react';
import { DAYS } from '@/data/days';
import { trackCustom } from '@/lib/pixel';
import CheckoutButton from '../CheckoutButton';
import Icon from '../Icon';
import { Corner } from '../CreamDecor';

// 40-day calendar: tap any day to see that day's guidance. Gold-framed, with a
// maroon panel for the chosen day — matching the devotional cards above.
export default function DayExplorer() {
  const [sel, setSel] = useState(1);
  const tracked = useRef(false);
  const day = DAYS[sel - 1];

  const pick = (n: number) => {
    setSel(Math.min(40, Math.max(1, n)));
    if (!tracked.current) {
      tracked.current = true;
      trackCustom('ExploreDays');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-6xl rounded-[2rem] bg-gradient-to-br from-[#f7d77a] via-[#d9a43a] to-[#b8781c] p-[2px] shadow-[0_40px_80px_-45px_var(--maroon)]">
      <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-[radial-gradient(ellipse_at_top,#fffaf0,var(--cream)_55%,#f8e9d2)] px-4 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
        <div className="pointer-events-none absolute inset-2 rounded-[1.7rem] border border-[var(--gold)]/45" aria-hidden="true" />
        <Corner className="left-1 top-1 -scale-y-100" />
        <Corner className="right-1 top-1 -scale-100" />
        <Corner className="bottom-1 left-1" />
        <Corner className="bottom-1 right-1 -scale-x-100" />

        {/* heading */}
        <div className="relative text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-1 text-sm font-bold text-[#fff1cf]">
            <Icon name="calendar" className="text-[#f7d77a]" /> 40 दिन का कैलेंडर
          </span>
          <h3 className="mt-3 font-display text-[1.7rem] leading-tight text-[var(--maroon)] sm:text-4xl">
            किसी भी दिन पर टैप करें — <span className="text-[var(--sindoor)]">देखें उस दिन क्या होगा</span>
          </h3>
          <div className="mt-3 flex items-center justify-center gap-2 text-[var(--primary)]" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <Icon name="lotus" className="text-lg" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>
        </div>

        <div className="relative mt-8 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          {/* calendar */}
          <div>
            <div className="grid grid-cols-8 gap-1.5 sm:gap-2.5" role="listbox" aria-label="40 दिन">
              {DAYS.map((d) => {
                const active = d.day === sel;
                const done = d.day < sel;
                return (
                  <button
                    key={d.day}
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(d.day)}
                    className={`relative aspect-square rounded-xl text-sm font-bold transition-all duration-300 sm:rounded-2xl sm:text-base ${
                      active
                        ? 'z-10 scale-110 border-2 border-[#f7d77a] bg-[radial-gradient(circle_at_35%_30%,#a8321f,var(--maroon))] font-display text-lg text-[#f7d77a] shadow-[0_10px_24px_-8px_var(--maroon)] sm:text-xl'
                        : done
                          ? 'border border-[var(--gold)]/60 bg-gradient-to-b from-[#fde9c4] to-[#f7d7a1] text-[var(--maroon)] hover:-translate-y-0.5'
                          : 'border border-[var(--gold)]/30 bg-white/70 text-[var(--maroon)]/70 hover:-translate-y-0.5 hover:border-[var(--gold)] hover:text-[var(--maroon)]'
                    }`}
                    aria-label={`दिन ${d.day}${d.milestone ? ` — ${d.milestone}` : ''}`}
                  >
                    {d.day}
                    {d.milestone && (
                      <Icon
                        name="lotus"
                        className={`absolute -right-1 -top-1 rounded-full p-0.5 text-[13px] sm:text-[15px] ${
                          active ? 'bg-[#f7d77a] text-[var(--maroon)]' : 'bg-[var(--cream)] text-[var(--sindoor)] ring-1 ring-[var(--gold)]/60'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--maroon)]/70 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="lotus" className="rounded-full bg-[var(--cream)] p-0.5 text-[var(--sindoor)] ring-1 ring-[var(--gold)]/60" /> विशेष पड़ाव
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md border border-[var(--gold)]/60 bg-gradient-to-b from-[#fde9c4] to-[#f7d7a1]" /> पूरे हुए दिन
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-md border border-[#f7d77a] bg-[var(--maroon)]" /> चुना हुआ दिन
              </span>
            </div>
          </div>

          {/* chosen day — a maroon panel in a gold frame */}
          <div className="rounded-[1.6rem] bg-gradient-to-b from-[#f7d77a] to-[#b8781c] p-[2px] shadow-[0_30px_60px_-30px_var(--maroon)]">
            <div
              key={sel}
              className="hero-in relative overflow-hidden rounded-[calc(1.6rem-2px)] bg-[radial-gradient(ellipse_at_top_right,#a8321f,var(--maroon)_55%,oklch(0.27_0.09_28))] p-5 text-[#fff1cf] sm:p-7"
            >
              <div className="bg-mandala pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
              <span className="pointer-events-none absolute -right-6 -top-8 font-display text-[9rem] leading-none text-[#f7d77a]/[0.08]" aria-hidden="true">
                {sel}
              </span>

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-5xl leading-none text-[#f7d77a] sm:text-6xl">
                    दिन {sel}
                    <span className="ml-1 text-xl text-[#fff1cf]/60">/40</span>
                  </p>
                  {day.milestone && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#f7d77a]/70 bg-[#f7d77a]/15 px-3 py-1 text-sm font-bold text-[#f7d77a]">
                      <Icon name="lotus" /> {day.milestone}
                    </span>
                  )}
                </div>

                {/* progress with a diya riding at the tip */}
                <div className="relative mt-5 h-2 rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#f7d77a] to-[var(--primary)] transition-[width] duration-500" style={{ width: `${(sel / 40) * 100}%` }} />
                  <span
                    className="absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#f7d77a] text-xs text-[var(--maroon)] shadow-[0_0_12px_#f7d77a] transition-[left] duration-500"
                    style={{ left: `${(sel / 40) * 100}%` }}
                    aria-hidden="true"
                  >
                    <Icon name="flame" />
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#fff1cf]/60">{Math.round((sel / 40) * 100)}% साधना पूर्ण</p>

                <figure className="mt-5">
                  <Icon name="quote" className="text-2xl text-[#f7d77a]/70" />
                  <blockquote className="mt-2 font-display text-lg leading-relaxed sm:text-xl">{day.message}</blockquote>
                  <figcaption className="mt-3 flex items-center gap-2 text-sm text-[#f7d77a]">
                    <span className="h-px w-8 bg-[#f7d77a]/60" /> दिन {sel} का मार्गदर्शन
                  </figcaption>
                </figure>

                <div className="mt-6 flex items-center gap-2">
                  <button
                    onClick={() => pick(sel - 1)}
                    disabled={sel === 1}
                    className="grid h-11 w-11 rotate-180 place-items-center rounded-full border border-[#f7d77a]/50 text-lg text-[#f7d77a] transition hover:bg-[#f7d77a]/15 disabled:opacity-30"
                    aria-label="पिछला दिन"
                  >
                    <Icon name="arrowRight" />
                  </button>
                  <button
                    onClick={() => pick(sel + 1)}
                    disabled={sel === 40}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#f7d77a]/50 text-lg text-[#f7d77a] transition hover:bg-[#f7d77a]/15 disabled:opacity-30"
                    aria-label="अगला दिन"
                  >
                    <Icon name="arrowRight" />
                  </button>
                  <CheckoutButton placement="day-explorer" size="sm" className="ml-auto">
                    दिन 1 से शुरू करें
                  </CheckoutButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
