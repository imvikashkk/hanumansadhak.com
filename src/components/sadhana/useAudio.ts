'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

// State for one <audio> element whose src may change. Playing state comes from the element's own
// events, so headphone buttons, phone calls and blocked autoplay can't leave the UI out of step.
// `keepPlaying` carries "the listener wants sound" across a track change, which is what lets the
// next track start by itself. Reusing one element also keeps mobile browsers' play permission.
export function useAudio(src: string, { onEnded, onTime }: { onEnded?: () => void; onTime?: (t: number, duration: number) => void } = {}) {
  const ref = useRef<HTMLAudioElement>(null);
  const keepPlaying = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function start() {
    keepPlaying.current = true;
    ref.current?.play().catch((err: DOMException) => {
      if (err.name !== 'AbortError') keepPlaying.current = false;
    });
  }

  useEffect(() => {
    if (keepPlaying.current) start();
  }, [src]);

  return {
    playing,
    buffering,
    failed,
    currentTime,
    duration,
    // Fill for the .audio-range seek bar.
    rangeStyle: { '--pct': `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties,
    // Next src should start playing as soon as it is set.
    playNext() {
      keepPlaying.current = true;
    },
    toggle() {
      const audio = ref.current;
      if (!audio) return;
      if (audio.paused) start();
      else audio.pause();
    },
    seek(t: number) {
      const audio = ref.current;
      if (!audio) return;
      audio.currentTime = Math.max(0, duration ? Math.min(duration, t) : t);
      setCurrentTime(audio.currentTime);
    },
    retry() {
      setFailed(false);
      ref.current?.load();
      start();
    },
    audioProps: {
      ref,
      src,
      preload: 'metadata',
      onEmptied: () => {
        setCurrentTime(0);
        setDuration(0);
        setFailed(false);
      },
      onPlay: () => setPlaying(true),
      onPause: () => {
        setPlaying(false);
        setBuffering(false);
        if (!ref.current?.ended) keepPlaying.current = false;
      },
      onWaiting: () => setBuffering(true),
      onPlaying: () => setBuffering(false),
      onLoadedMetadata: () => setDuration(ref.current?.duration ?? 0),
      onTimeUpdate: () => {
        const audio = ref.current;
        if (!audio) return;
        setCurrentTime(audio.currentTime);
        onTime?.(audio.currentTime, audio.duration);
      },
      onEnded: () => {
        keepPlaying.current = false;
        onEnded?.();
      },
      onError: () => {
        keepPlaying.current = false;
        setBuffering(false);
        setFailed(true);
      },
    },
  };
}
