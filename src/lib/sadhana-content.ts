// Saare audio aur lyrics JSON se aate hain — naya audio/lyric jodna ho to sirf JSON badlo.
// Server-only by use: pages hand each client player just the tracks it may play, so the full
// 100 KB file (and every day's audio link) never reaches the browser.
import data from '@/data/hanuman_40_day_stuti.json';
import { SADHANA_DAYS } from './sadhana';

interface RawTrack { src: string; label: string; lyrics: string | null }
interface RawDay { day: number; pre: RawTrack[]; main: RawTrack; post: RawTrack[] }

export interface LyricLine { time: number; text: string }
export interface Track { src: string; label: string; lines: LyricLine[] }

const lyrics = data.lyrics as Record<string, LyricLine[]>;
const days = data.days as RawDay[];

function toTrack(t: RawTrack): Track {
  return { src: t.src, label: t.label, lines: t.lyrics ? (lyrics[t.lyrics] ?? []) : [] };
}

export function getSankalpTrack(): Track {
  return toTrack(data.sankalp as RawTrack);
}

// The day's practice in order: guidance → (extra jap) → chalisa → (closing), with the index of
// the main track, which is the one that must be heard to complete the day.
export function getDayPlaylist(day: number): { playlist: Track[]; mainIndex: number } | null {
  if (day > SADHANA_DAYS) return null;
  const entry = days.find((d) => d.day === day);
  if (!entry) return null;
  return { playlist: [...entry.pre, entry.main, ...entry.post].map(toTrack), mainIndex: entry.pre.length };
}
