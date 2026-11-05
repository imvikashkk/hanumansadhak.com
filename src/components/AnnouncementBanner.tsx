'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { RecentJoin } from '@/app/api/recent-joins/route';
import { SITE } from '@/data/site';
import { PRODUCT_PARAMS, track } from '@/lib/pixel';
import Icon from './Icon';

const ROTATE_MS = 4000;

// "अभी" only for joins from the last day — older ones get no time at all, never a false "just now".
const RECENT_SEC = 86400;

// Top bar: the devotee count, then the newest sadhaks one by one (newest first, then loops).
export default function AnnouncementBanner() {
  const [joins, setJoins] = useState<(RecentJoin & { fetchedAt: number })[]>([]);
  // `now` is taken on each rotation tick so render stays pure.
  const [{ index, now }, setTick] = useState({ index: 0, now: 0 });

  useEffect(() => {
    fetch('/api/recent-joins')
      .then((r) => (r.ok ? r.json() : { joins: [] }))
      .then((d: { joins: RecentJoin[] }) => setJoins(d.joins.map((j) => ({ ...j, fetchedAt: Date.now() }))))
      .catch(() => {});
  }, []);

  // Slot 0 is the devotee count; slots 1..n are the joins.
  const slots = joins.length + 1;
  useEffect(() => {
    if (slots < 2) return;
    const t = window.setInterval(() => setTick((p) => ({ index: (p.index + 1) % slots, now: Date.now() })), ROTATE_MS);
    return () => window.clearInterval(t);
  }, [slots]);

  const join = index > 0 ? joins[index - 1] : null;
  const recent = join ? join.agoSec + Math.max(0, Math.round((now - join.fetchedAt) / 1000)) < RECENT_SEC : false;

  return (
    <div data-site-header className="fixed top-0 z-50 w-full bg-ember transition-transform duration-300 text-[var(--primary-foreground)] shadow-card">
      <Link
        href={SITE.joinUrl}
        onClick={() => track('InitiateCheckout', { ...PRODUCT_PARAMS, placement: 'banner' })}
        className="mx-auto flex h-[var(--banner-h)] max-w-7xl items-center justify-center gap-3 px-3 text-[13px] font-semibold sm:gap-4 sm:text-sm"
      >
        <span className="flex h-full min-w-0 items-center overflow-hidden" aria-live="polite">
          <span key={index} className="ticker-in flex min-w-0 items-center gap-2">
            {join ? (
              <>
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-white/80 motion-safe:animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--primary-foreground)]/15 text-xs font-extrabold" aria-hidden="true">
                  {join.name[0]}
                </span>
                <span className="truncate">
                  <strong className="font-extrabold">{join.name}</strong> ने{recent && ' अभी'}{' '}
                  {join.city ? (
                    <>
                      <strong className="font-extrabold">{join.city}</strong> से जॉइन किया
                    </>
                  ) : (
                    'साधना जॉइन की'
                  )}
                </span>
              </>
            ) : (
              <>
                <Icon name="flame" className="shrink-0 text-base" />
                <span className="truncate">
                  {SITE.devotees} भक्त जुड़ चुके हैं<span className="hidden sm:inline"> — आज ही संकल्प लें</span>
                </span>
              </>
            )}
          </span>
        </span>
        <span className="shrink-0 font-extrabold underline underline-offset-4">
          <span className="hidden sm:inline">अभी </span>जॉइन करें →
        </span>
      </Link>
    </div>
  );
}
