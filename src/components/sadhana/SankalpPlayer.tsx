'use client';

import type { Track } from '@/lib/sadhana-content';
import Icon from '../Icon';
import { GoldCard } from './AppShell';
import { formatTime, useAudio } from './useAudio';

// The rule-of-the-sankalp recording. `urgent` until the first day is done.
export default function SankalpPlayer({ track, urgent }: { track: Track; urgent: boolean }) {
  const a = useAudio(track.src);

  return (
    <GoldCard>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={a.toggle}
          aria-label={a.playing ? 'रोकें' : 'सुनें'}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ember text-xl text-[var(--primary-foreground)] shadow-glow transition-transform active:scale-95"
        >
          <Icon name={a.playing ? 'pause' : 'play'} />
        </button>
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight">{track.label}</h2>
          <p className={`mt-0.5 text-sm font-semibold ${urgent ? 'text-[var(--sindoor)]' : 'text-[var(--maroon)]/70'}`}>
            {urgent && <Icon name="warning" className="mr-1 align-[-2px]" />}
            {urgent ? 'पहले दिन से पहले यह ज़रूर सुनें' : 'कभी भी दोबारा सुन सकते हैं'}
          </p>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={a.duration || 100}
        step="any"
        value={a.currentTime}
        onChange={(e) => a.seek(Number(e.target.value))}
        aria-label="ऑडियो की स्थिति"
        className="audio-range mt-2"
        style={a.rangeStyle}
      />
      <p className="text-right text-sm tabular-nums text-[var(--maroon)]/70">
        {a.failed ? 'ऑडियो लोड नहीं हुआ' : `${formatTime(a.currentTime)} / ${a.duration ? formatTime(a.duration) : '--:--'}`}
      </p>
      <audio {...a.audioProps} />
    </GoldCard>
  );
}
