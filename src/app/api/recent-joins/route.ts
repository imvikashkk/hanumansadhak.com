import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';

// Newest sadhaks for the announcement banner ("राम ने वाराणसी से जॉइन किया").
// Public, so only a first name + city go out — never the phone or full name.
// Cached in memory for a minute so a busy page doesn't hit the database on every view.

const LIMIT = 60;
const TTL_MS = 60_000;

interface Row { name: string; city: string | null; ago_sec: number }
export interface RecentJoin { name: string; city: string | null; agoSec: number }

let cache: { at: number; joins: RecentJoin[] } | null = null;

// "ramesh kumar" / "RAMESH" / "ramesh.kumar" → "Ramesh"; Devanagari passes through unchanged.
const firstWord = (s: string, max: number) => {
  const w = s.trim().split(/[\s._]+/)[0].slice(0, max).toLowerCase();
  return w.charAt(0).toUpperCase() + w.slice(1);
};
// Skips keyboard-mash entries ("Hjjhjkfmk") so the banner only shows real-looking names.
const looksReal = (w: string) =>
  w.length >= 2 && (/\p{Script=Devanagari}/u.test(w) || (/^[a-z.'-]+$/i.test(w) && /[aeiouy]/i.test(w) && !/[^aeiouy.'-]{5}/i.test(w)));
const tidy = (s: string, max: number) =>
  s.trim().replace(/\s+/g, ' ').slice(0, max).replace(/(^|\s)\p{Ll}/gu, (c) => c.toUpperCase());

export async function GET() {
  if (!cache || Date.now() - cache.at > TTL_MS) {
    try {
      await migrate();
      // Age is computed in SQL so the DB's clock (and timezone) is the only one that matters.
      const rows = await query<Row>(
        `SELECT name, city, EXTRACT(EPOCH FROM (NOW() - created_at))::int AS ago_sec
         FROM users WHERE name IS NOT NULL AND btrim(name) <> ''
         ORDER BY created_at DESC LIMIT $1`,
        [LIMIT * 2]
      );
      const joins = rows
        .map((r) => ({ name: firstWord(r.name, 18), city: r.city?.trim() ? tidy(r.city, 22) : null, agoSec: Math.max(0, r.ago_sec) }))
        .filter((j) => looksReal(j.name))
        .slice(0, LIMIT);
      cache = { at: Date.now(), joins };
    } catch (err) {
      console.error('recent-joins failed', err);
      return NextResponse.json({ joins: [] }, { status: 503 });
    }
  }

  // Ages drift while cached — add the time since the snapshot.
  const drift = Math.round((Date.now() - cache.at) / 1000);
  return NextResponse.json(
    { joins: cache.joins.map((j) => ({ ...j, agoSec: j.agoSec + drift })) },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  );
}
