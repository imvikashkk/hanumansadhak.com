'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import type { VideoItem } from '@/data/media';
import { trackCustom } from '@/lib/pixel';
import Icon from '../Icon';
import { useVideoSource, VIDEO_PLAY_EVENT, videoPoster, youtubeId } from './useVideoSource';

// Click-to-play video: shows the poster until tapped, then plays inline.
// Starting one pauses every other player on the page.
// `autoStart` skips the poster (for a card mounted by a tap); `badge` is e.g. the duration.
const ASPECT = { wide: 'aspect-video', reel: 'aspect-[9/16]', portrait: 'aspect-[4/5]' };

export default function VideoCard({
  video,
  shape = 'wide',
  sizes,
  caption = true,
  badge,
  autoStart = false,
}: {
  video: VideoItem;
  shape?: keyof typeof ASPECT;
  sizes: string;
  caption?: boolean;
  badge?: string;
  autoStart?: boolean;
}) {
  const id = useId();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoStart);
  const ytId = youtubeId(video.src);

  useVideoSource(ref, ytId ? '' : video.src, playing);

  useEffect(() => {
    const onOtherPlay = (e: Event) => {
      if ((e as CustomEvent<string>).detail === id) return;
      ref.current?.pause();
      // A YouTube iframe can't be paused from here — unmount it instead.
      if (ytId) setPlaying(false);
    };
    window.addEventListener(VIDEO_PLAY_EVENT, onOtherPlay);
    return () => window.removeEventListener(VIDEO_PLAY_EVENT, onOtherPlay);
  }, [id, ytId]);

  const start = () => {
    window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT, { detail: id }));
    trackCustom('VideoPlay', { title: video.title });
    setPlaying(true);
  };

  useEffect(() => {
    if (!autoStart) return;
    window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT, { detail: id }));
    trackCustom('VideoPlay', { title: video.title });
  }, [autoStart, id, video.title]);

  const poster = videoPoster(video);

  return (
    <div
      data-video-card
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-card ${ASPECT[shape]}`}
    >
      {playing && ytId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : playing ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          poster={poster}
          controls
          autoPlay
          playsInline
          onPlay={() => window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT, { detail: id }))}
        />
      ) : (
        <button onClick={start} className="group absolute inset-0 h-full w-full" aria-label={`वीडियो चलाएं: ${video.title}`}>
          {poster ? (
            <Image
              src={poster}
              alt={video.title}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 bg-ember opacity-30" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="cta-pulse flex h-16 w-16 items-center justify-center rounded-full bg-ember text-2xl text-[var(--primary-foreground)] shadow-glow transition-transform group-hover:scale-110">
              <Icon name="play" className="ml-1" />
            </span>
          </span>
          {caption && (
            <span className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-semibold text-white sm:text-base">
              {video.title}
            </span>
          )}
          {badge && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold tabular-nums text-white">
              {badge}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
