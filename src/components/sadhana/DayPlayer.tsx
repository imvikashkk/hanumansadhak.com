'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '@/assets/hanuman_sadhak_logo.png';
import type { Track } from '@/lib/sadhana-content';
import { PRODUCT_NAME, SADHANA_DAYS } from '@/lib/sadhana';
import Icon from '../Icon';
import { DarkCard, emberButton, GoldCard } from './AppShell';
import { formatTime, useAudio } from './useAudio';

// The track's lyric line playing at time t.
function lineAt(track: Track, t: number) {
  let text = track.lines[0]?.text ?? null;
  for (const line of track.lines) if (t >= line.time) text = line.text;
  return text;
}

// One day's practice. Mounted with key={day}, so moving between days starts from fresh state.
export default function DayPlayer({
  day,
  playlist,
  mainIndex,
  alreadyDone,
}: {
  day: number;
  playlist: Track[];
  mainIndex: number;
  alreadyDone: boolean;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState<number[]>([]);
  const [listened, setListened] = useState(false);
  const [marked, setMarked] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');

  const track = playlist[index];
  const isMain = index === mainIndex;
  const a = useAudio(track.src, {
    onTime(t, duration) {
      // The chalisa must actually be heard before the day can be completed.
      if (isMain && !listened && t >= Math.min(30, duration * 0.7)) setListened(true);
    },
    onEnded() {
      if (isMain) setListened(true);
      setHeard((h) => [...h, index]);
      if (index < playlist.length - 1) {
        a.playNext();
        setIndex(index + 1);
      }
    },
  });

  // Names the track on the lock screen, since most listen with the phone in a pocket.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.label,
      artist: `दिन ${day} · ${PRODUCT_NAME}`,
      artwork: [{ src: logo.src, sizes: `${logo.width}x${logo.height}`, type: 'image/png' }],
    });
  }, [track.label, day]);

  async function markComplete() {
    setMarking(true);
    setError('');
    try {
      const res = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'सेव नहीं हो पाया, फिर कोशिश करें');
        return;
      }
      setMarked(true);
      router.refresh();
    } catch {
      setError('इंटरनेट की समस्या — फिर कोशिश करें');
    } finally {
      setMarking(false);
    }
  }

  const done = alreadyDone || marked;
  const lastDay = day === SADHANA_DAYS;

  return (
    <div className="space-y-5">
      {/* what is being said right now */}
      <DarkCard>
        <div className="flex min-h-40 flex-col items-center justify-center bg-mandala px-5 py-7 text-center sm:min-h-48">
          <p className="text-sm font-bold text-[#f7d77a]">{track.label}</p>
          <p key={lineAt(track, a.currentTime) ?? track.label} className="ticker-in mt-3 font-display text-[1.65rem] leading-snug sm:text-4xl" aria-live="off">
            {lineAt(track, a.currentTime) ?? track.label}
          </p>
        </div>
      </DarkCard>

      <GoldCard>
        <input
          type="range"
          min={0}
          max={a.duration || 100}
          step="any"
          value={a.currentTime}
          onChange={(e) => a.seek(Number(e.target.value))}
          aria-label="ऑडियो की स्थिति"
          className="audio-range"
          style={a.rangeStyle}
        />
        <div className="flex justify-between text-sm font-semibold tabular-nums text-[var(--maroon)]/70">
          <span>{formatTime(a.currentTime)}</span>
          <span>{a.duration ? formatTime(a.duration) : '--:--'}</span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-5 sm:gap-8">
          <button type="button" onClick={() => a.seek(a.currentTime - 10)} aria-label="10 सेकंड पीछे" className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-[var(--maroon)]/15 bg-white/70 text-xs font-bold active:bg-white">
            <Icon name="back10" className="text-2xl" /> 10s
          </button>
          <button
            type="button"
            onClick={a.toggle}
            aria-label={a.playing ? 'रोकें' : 'चलाएं'}
            className={`grid h-24 w-24 place-items-center rounded-full bg-ember text-4xl text-[var(--primary-foreground)] shadow-glow transition-transform active:scale-95 ${a.playing ? '' : 'cta-pulse'}`}
          >
            <Icon name={a.playing ? 'pause' : 'play'} />
          </button>
          <button type="button" onClick={() => a.seek(a.currentTime + 10)} aria-label="10 सेकंड आगे" className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-[var(--maroon)]/15 bg-white/70 text-xs font-bold active:bg-white">
            <Icon name="forward10" className="text-2xl" /> 10s
          </button>
        </div>

        {a.failed ? (
          <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
            ऑडियो लोड नहीं हुआ।{' '}
            <button type="button" onClick={a.retry} className="font-bold underline">फिर कोशिश करें</button>
          </div>
        ) : (
          <p className="mt-3 text-center text-base text-[var(--maroon)]/75">
            {a.buffering ? 'लोड हो रहा है…' : a.playing ? 'चल रहा है…' : 'बीच का बटन दबाकर सुनें'}
          </p>
        )}
        <audio {...a.audioProps} />

        {/* today's steps */}
        <ol className="mt-4 space-y-1.5 border-t border-[var(--gold)]/30 pt-4">
          {playlist.map((t, i) => {
            const active = i === index;
            const finished = heard.includes(i);
            return (
              <li key={t.src}>
                <button
                  type="button"
                  onClick={() => {
                    if (!active) a.playNext();
                    setIndex(i);
                  }}
                  aria-current={active ? 'step' : undefined}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${active ? 'bg-[var(--sindoor)]/10 ring-1 ring-[var(--sindoor)]/40' : 'active:bg-black/5'}`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold ${finished ? 'bg-ember text-[var(--primary-foreground)]' : active ? 'border-2 border-[var(--sindoor)] text-[var(--sindoor)]' : 'bg-[var(--maroon)]/10'}`}>
                    {finished ? <Icon name="check" /> : i + 1}
                  </span>
                  <span className={`min-w-0 flex-1 leading-snug ${active ? 'font-bold' : ''}`}>{t.label}</span>
                  {i === mainIndex && <span className="shrink-0 rounded-full bg-[#f7d77a]/50 px-2.5 py-0.5 text-xs font-bold">मुख्य</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </GoldCard>

      <GoldCard>
        {done ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ember text-3xl text-[var(--primary-foreground)] shadow-glow">
              <Icon name="check" />
            </span>
            <h2 className="mt-3 font-display text-3xl">दिन {day} पूरा हुआ</h2>
            <p className="mt-1 text-[var(--maroon)]/80">हनुमान जी की कृपा आप पर सदा बनी रहे</p>
            <Link href={lastDay ? '/sadhana/certificate' : '/sadhana'} className={`${emberButton} mt-5`}>
              {lastDay ? 'अपना प्रमाणपत्र देखें' : 'चार्ट पर वापस जाएं'} <Icon name="arrowRight" />
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-display text-2xl leading-snug">
              {listened ? 'बहुत बढ़िया! अब आज का दिन पूरा करें' : `पहले ${playlist[mainIndex].label} सुनें`}
            </h2>
            <p className="mt-1 text-[var(--maroon)]/75">{listened ? 'नीचे बटन दबाएं' : 'सुनने के बाद यह बटन चालू हो जाएगा'}</p>
            {error && <p role="alert" className="mt-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="button" onClick={markComplete} disabled={!listened || marking} className={`${emberButton} mt-4`}>
              <Icon name={listened ? 'check' : 'lock'} /> {marking ? 'सेव हो रहा है…' : `दिन ${day} पूरा हुआ`}
            </button>
          </div>
        )}
      </GoldCard>
    </div>
  );
}
