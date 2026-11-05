'use client';

import { useEffect, useRef, useState } from 'react';
import { PHASES } from '@/data/content';
import Icon from '../Icon';
import { Reveal } from '../Reveal';
import { Corner } from '../CreamDecor';

// Vertical timeline whose line fills in as you scroll, lighting up each
// stage as it is reached. Line on the left on phones, centred (with cards
// alternating sides) on desktop.
export default function PhaseTimeline() {
  const wrapRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const mark = window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, (mark - rect.top) / rect.height)));
      setReached(nodeRefs.current.filter((n) => n && n.getBoundingClientRect().top < mark).length);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <ol ref={wrapRef} className="relative mx-auto mt-12 max-w-5xl">
      {/* track + fill */}
      <span className="absolute bottom-0 left-6 top-0 w-1 -translate-x-1/2 rounded-full bg-[var(--gold)]/25 lg:left-1/2" aria-hidden="true" />
      <span
        className="absolute left-6 top-0 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-[var(--gold)] via-[var(--primary)] to-[oklch(0.6_0.22_30)] shadow-[0_0_18px_var(--primary)] transition-[height] duration-150 lg:left-1/2"
        style={{ height: `${progress * 100}%` }}
        aria-hidden="true"
      />

      {PHASES.map((p, i) => {
        const on = i < reached;
        const right = i % 2 === 1;
        return (
          <li key={p.range} className="relative pb-10 pl-16 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
            {/* node — maroon medallion in a gold ring, lights up once reached */}
            <span
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className={`absolute left-6 top-6 z-10 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full p-[3px] transition-all duration-500 lg:left-1/2 ${
                on ? 'scale-110 bg-gradient-to-b from-[#f7d77a] to-[#b8781c] shadow-[0_0_24px_-2px_var(--primary)]' : 'bg-gradient-to-b from-[#f7d77a]/80 to-[#b8781c]/60'
              }`}
            >
              <span
                className={`grid h-full w-full place-items-center rounded-full border-2 border-[var(--cream)] text-xl transition-colors duration-500 ${
                  on ? 'bg-[radial-gradient(circle_at_35%_30%,#9b2c1c,var(--maroon))] text-[#f7d77a]' : 'bg-[var(--card)] text-[var(--sindoor)]/70'
                }`}
              >
                <Icon name={p.icon} />
              </span>
            </span>

            <Reveal y={18} className={`${right ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'}`}>
              {/* gold frame */}
              <div
                className={`group rounded-[1.6rem] bg-gradient-to-br p-[2px] transition-all duration-500 hover:-translate-y-1 ${
                  on ? 'from-[#f7d77a] via-[#d9a43a] to-[#b8781c] shadow-[0_28px_60px_-34px_var(--maroon)]' : 'from-[var(--gold)]/50 to-[var(--gold)]/20'
                }`}
              >
                <div className="relative overflow-hidden rounded-[calc(1.6rem-2px)] bg-[radial-gradient(ellipse_at_top,#fffaf0,var(--cream)_60%,#f8e9d2)] px-5 pb-11 pt-6 sm:px-7 sm:pb-11">
                  <div className="pointer-events-none absolute inset-1.5 rounded-[1.35rem] border border-[var(--gold)]/45" aria-hidden="true" />
                  <Corner className="bottom-1 left-1" />
                  <Corner className="bottom-1 right-1 -scale-x-100" />
                  {/* the phase's icon as a large faint watermark */}
                  <span
                    className={`pointer-events-none absolute -top-4 text-[8.5rem] leading-none text-[var(--sindoor)]/[0.07] transition-transform duration-700 group-hover:scale-110 ${right ? '-right-4' : '-right-4 lg:-left-4 lg:right-auto'}`}
                    aria-hidden="true"
                  >
                    <Icon name={p.icon} />
                  </span>

                  <div className="relative">
                    {/* day range on a maroon ribbon */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-3.5 py-1 text-sm font-bold text-[#fff1cf] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
                      <Icon name="flame" className="text-[#f7d77a]" />
                      {p.range}
                    </span>
                    <h3 className="mt-3 font-display text-[1.7rem] leading-tight text-[var(--maroon)]">{p.title}</h3>
                    <div className={`mt-2 flex items-center gap-2 text-[var(--primary)] ${right ? '' : 'lg:flex-row-reverse'}`} aria-hidden="true">
                      <span className={`h-px w-16 ${right ? 'bg-gradient-to-r' : 'bg-gradient-to-r lg:bg-gradient-to-l'} from-[var(--gold)] to-transparent`} />
                      <Icon name="lotus" className="text-base" />
                    </div>

                    <ul className={`mt-3 space-y-2.5 ${right ? '' : 'lg:ml-auto'}`}>
                      {p.points.map((pt) => (
                        <li
                          key={pt}
                          className={`flex items-start gap-3 text-base text-[var(--maroon)]/85 ${right ? '' : 'lg:flex-row-reverse'}`}
                        >
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--gold)]/60 bg-white/70 text-sm text-[var(--sindoor)]">
                            <Icon name="lotus" />
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <p
                      className={`mt-5 flex items-start gap-2.5 rounded-2xl border border-[var(--gold)]/60 bg-gradient-to-b from-[#9b2c1c] to-[var(--maroon)] px-4 py-3 text-left text-sm text-[#fff1cf] shadow-[0_10px_24px_-16px_var(--maroon)] ${right ? '' : 'lg:flex-row-reverse lg:text-right'}`}
                    >
                      <Icon name="sparkle" className="mt-0.5 shrink-0 text-base text-[#f7d77a]" />
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-[#f7d77a]">आप महसूस करेंगे</span>
                        <span className="font-display text-base leading-snug">{p.feel}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
